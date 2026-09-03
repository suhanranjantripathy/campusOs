import puppeteer, { Browser, Page, Cookie } from "puppeteer";
import type { NewtonProfile, NewtonAttendance, NewtonAssignment, SessionToken } from "@/types/newton";

const NEWTON_BASE_URL = "https://my.newtonschool.co";
const NEWTON_LOGIN_URL = `${NEWTON_BASE_URL}/login`;

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }
  browserInstance = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  });
  return browserInstance;
}

async function getPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1280, height: 800 });
  return page;
}

/**
 * Authenticates with Newton School and returns a serialized session token (cookies).
 * This runs on the server side only.
 */
export async function authenticateNewton(
  email: string,
  password: string
): Promise<SessionToken> {
  const browser = await getBrowser();
  const page = await getPage(browser);

  try {
    console.log("[Newton] Navigating to login page...");
    await page.goto(NEWTON_LOGIN_URL, { waitUntil: "networkidle2", timeout: 30000 });

    await page.waitForSelector("#email", { timeout: 15000 });
    // Use native DOM injection to bypass React's event dropping which was truncating the email
    await page.evaluate((em, pw) => {
      const setNativeValue = (selector: string, value: string) => {
        const el = document.querySelector(selector) as HTMLInputElement;
        if (!el) return;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        nativeInputValueSetter?.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };

      setNativeValue('#email', em);
      setNativeValue('#password', pw);
    }, email, password);

    // Newton's login button has type="button" and text "Login"
    // Wait for it to become enabled
    const loginBtnSelector = await page.evaluate(async () => {
      return new Promise<string>((resolve, reject) => {
        let attempts = 0;
        const check = setInterval(() => {
          attempts++;
          const buttons = Array.from(document.querySelectorAll('button'));
          const loginBtn = buttons.find(b => b.innerText.trim() === 'Login');
          
          if (loginBtn && !loginBtn.disabled) {
            clearInterval(check);
            loginBtn.id = '__newton_login_btn__';
            resolve('#__newton_login_btn__');
          } else if (attempts > 50) { // 5 seconds
            clearInterval(check);
            reject(new Error('Login button never became enabled. Check if email/password format is correct.'));
          }
        }, 100);
      });
    });

    await page.click(loginBtnSelector);
    // Also press Enter just in case the button click is intercepted
    await page.keyboard.press('Enter');

    try {
      // Wait for the URL to change away from the login page (SPA routing)
      await page.waitForFunction(
        () => !window.location.href.includes('/login'),
        { timeout: 15000 }
      );
    } catch (e) {
      // If it times out, we will check the URL below to throw the auth error
      console.log("[Newton] Wait for URL change timed out, checking current URL...");
    }

    const currentUrl = page.url();
    if (currentUrl.includes("/login")) {
      throw new Error("Authentication failed. Please check your credentials.");
    }

    console.log("[Newton] Login successful. URL:", currentUrl);

    // Capture cookies for future requests
    const cookies: Cookie[] = await page.cookies();
    const serializedCookies = cookies
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    await page.close();

    return {
      cookies: serializedCookies,
      timestamp: Date.now(),
    };
  } catch (err) {
    await page.close();
    throw err;
  }
}

/**
 * Scrapes the user's profile from Newton School using an existing session token.
 */
export async function scrapeProfile(session: SessionToken): Promise<NewtonProfile> {
  const browser = await getBrowser();
  const page = await getPage(browser);

  try {
    // Restore session cookies
    const cookieArray = parseCookieString(session.cookies);
    for (const cookie of cookieArray) {
      await page.setCookie({ ...cookie, domain: "my.newtonschool.co" });
    }

    await page.goto(`${NEWTON_BASE_URL}/profile`, { waitUntil: "networkidle2", timeout: 30000 });

    // Extract profile data from the page
    const profile = await page.evaluate(() => {
      const getName = () =>
        (document.querySelector("[class*='profile'] h1, [class*='user-name'], [class*='userName']") as HTMLElement)?.innerText?.trim() ||
        (document.querySelector("h1, h2") as HTMLElement)?.innerText?.trim() || "";

      const getEmail = () =>
        (document.querySelector("[class*='email']") as HTMLElement)?.innerText?.trim() || "";

      const getText = (selector: string) =>
        (document.querySelector(selector) as HTMLElement)?.innerText?.trim() || "";

      const avatar = (document.querySelector("img[class*='avatar'], img[class*='profile']") as HTMLImageElement)?.src || "";

      return {
        name: getName(),
        email: getEmail(),
        rollNumber: getText("[class*='rollNumber'], [class*='roll']"),
        semester: getText("[class*='semester']"),
        department: getText("[class*='department'], [class*='branch']"),
        batch: getText("[class*='batch']"),
        avatarUrl: avatar,
      };
    });

    await page.close();
    return profile as NewtonProfile;
  } catch (err) {
    await page.close();
    throw err;
  }
}

/**
 * Intercepts the Newton School attendance API calls.
 * We navigate to the attendance page and capture the XHR API response.
 */
export async function scrapeAttendance(session: SessionToken): Promise<NewtonAttendance> {
  const browser = await getBrowser();
  const page = await getPage(browser);

  try {
    const cookieArray = parseCookieString(session.cookies);
    for (const cookie of cookieArray) {
      await page.setCookie({ ...cookie, domain: "my.newtonschool.co" });
    }

    // Intercept the attendance API response
    let attendanceData: NewtonAttendance | null = null;

    page.on("response", async (response) => {
      const url = response.url();
      if (
        url.includes("attendance") &&
        response.status() === 200 &&
        response.headers()["content-type"]?.includes("application/json")
      ) {
        try {
          const json = await response.json();
          console.log("[Newton] Intercepted attendance API:", url);
          // Normalize the response to our format
          attendanceData = normalizeAttendance(json);
        } catch {
          // Not a JSON response, skip
        }
      }
    });

    await page.goto(`${NEWTON_BASE_URL}/attendance`, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait a moment for XHR requests to complete
    await new Promise((r) => setTimeout(r, 3000));

    await page.close();

    if (!attendanceData) {
      // Fallback: scrape from DOM if API was not intercepted
      attendanceData = await scrapeAttendanceFromDom(session);
    }

    return attendanceData;
  } catch (err) {
    await page.close();
    throw err;
  }
}

/**
 * Fallback: scrape attendance data directly from the DOM.
 */
async function scrapeAttendanceFromDom(session: SessionToken): Promise<NewtonAttendance> {
  const browser = await getBrowser();
  const page = await getPage(browser);

  try {
    const cookieArray = parseCookieString(session.cookies);
    for (const cookie of cookieArray) {
      await page.setCookie({ ...cookie, domain: "my.newtonschool.co" });
    }

    await page.goto(`${NEWTON_BASE_URL}/attendance`, { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    const data = await page.evaluate(() => {
      // Generic selectors — will be tuned after first run
      const subjectCards = document.querySelectorAll(
        "[class*='subject'], [class*='course'], [class*='attendance-row'], tr"
      );

      const subjects: { id: string; name: string; faculty: string; attended: number; total: number; percentage: number }[] = [];

      subjectCards.forEach((card, i) => {
        const text = (card as HTMLElement).innerText || "";
        const percentMatch = text.match(/(\d+\.?\d*)\s*%/);
        const fractionMatch = text.match(/(\d+)\s*\/\s*(\d+)/);

        if (percentMatch && fractionMatch) {
          subjects.push({
            id: `subject-${i}`,
            name: (card.querySelector("h2, h3, h4, td:first-child, [class*='name']") as HTMLElement)?.innerText?.trim() || `Subject ${i + 1}`,
            faculty: (card.querySelector("[class*='faculty'], [class*='teacher']") as HTMLElement)?.innerText?.trim() || "",
            attended: parseInt(fractionMatch[1]),
            total: parseInt(fractionMatch[2]),
            percentage: parseFloat(percentMatch[1]),
          });
        }
      });

      const overallMatch = document.body.innerText.match(/overall[^%]*(\d+\.?\d*)\s*%/i);
      const overall = overallMatch ? parseFloat(overallMatch[1]) : 0;

      return { overall, subjects };
    });

    await page.close();
    return data as NewtonAttendance;
  } catch (err) {
    await page.close();
    throw err;
  }
}

/**
 * Intercepts the Newton School assignments API calls.
 */
export async function scrapeAssignments(session: SessionToken): Promise<NewtonAssignment[]> {
  const browser = await getBrowser();
  const page = await getPage(browser);

  try {
    const cookieArray = parseCookieString(session.cookies);
    for (const cookie of cookieArray) {
      await page.setCookie({ ...cookie, domain: "my.newtonschool.co" });
    }

    let assignmentData: NewtonAssignment[] | null = null;

    page.on("response", async (response) => {
      const url = response.url();
      if (
        (url.includes("assignment") || url.includes("homework")) &&
        response.status() === 200 &&
        response.headers()["content-type"]?.includes("application/json")
      ) {
        try {
          const json = await response.json();
          console.log("[Newton] Intercepted assignments API:", url);
          assignmentData = normalizeAssignments(json);
        } catch {
          // Not parseable, skip
        }
      }
    });

    await page.goto(`${NEWTON_BASE_URL}/assignments`, { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 3000));

    if (!assignmentData) {
      // Scrape DOM as fallback
      assignmentData = await page.evaluate(() => {
        const cards = document.querySelectorAll("[class*='assignment'], [class*='homework'], [class*='task-card']");
        const result: { id: string; title: string; subject: string; description: string; dueDate: string; status: "todo" | "in_progress" | "completed"; priority: "low" | "medium" | "high" }[] = [];
        
        cards.forEach((card, i) => {
          const title = (card.querySelector("h2, h3, h4, [class*='title']") as HTMLElement)?.innerText?.trim() || "";
          const subject = (card.querySelector("[class*='subject'], [class*='course']") as HTMLElement)?.innerText?.trim() || "";
          const description = (card.querySelector("p, [class*='description']") as HTMLElement)?.innerText?.trim() || "";
          const dueDateEl = (card.querySelector("[class*='due'], [class*='deadline'], [class*='date']") as HTMLElement)?.innerText?.trim() || "";
          
          if (title) {
            result.push({
              id: `assignment-${i}`,
              title,
              subject,
              description,
              dueDate: dueDateEl,
              status: "todo",
              priority: "medium",
            });
          }
        });

        return result;
      }) as NewtonAssignment[];
    }

    await page.close();
    return assignmentData || [];
  } catch (err) {
    await page.close();
    throw err;
  }
}

// --- Normalizers (adapt to whatever shape Newton's API returns) ---

function normalizeAttendance(raw: Record<string, unknown>): NewtonAttendance {
  // Try common response shapes
  const subjects = (
    (raw.data as Record<string, unknown>[] | undefined) ||
    (raw.subjects as Record<string, unknown>[] | undefined) ||
    (raw.result as Record<string, unknown>[] | undefined) ||
    (raw.attendance as Record<string, unknown>[] | undefined) ||
    []
  ) as Record<string, unknown>[];

  return {
    overall: (raw.overall as number) || (raw.overallPercentage as number) || 0,
    subjects: subjects.map((s, i) => ({
      id: String(s.id || s._id || i),
      name: String(s.name || s.subjectName || s.courseName || "Unknown"),
      faculty: String(s.faculty || s.teacher || s.facultyName || ""),
      attended: Number(s.attended || s.presentCount || s.present || 0),
      total: Number(s.total || s.totalClasses || s.totalCount || 0),
      percentage: Number(s.percentage || s.attendancePercentage || s.percent || 0),
    })),
  };
}

function normalizeAssignments(raw: Record<string, unknown>): NewtonAssignment[] {
  const items = (
    (raw.data as Record<string, unknown>[] | undefined) ||
    (raw.assignments as Record<string, unknown>[] | undefined) ||
    (raw.result as Record<string, unknown>[] | undefined) ||
    (Array.isArray(raw) ? raw : [])
  ) as Record<string, unknown>[];

  return items.map((a, i) => ({
    id: String(a.id || a._id || i),
    title: String(a.title || a.name || "Untitled"),
    subject: String(a.subject || a.course || a.subjectName || ""),
    description: String(a.description || a.content || ""),
    dueDate: String(a.dueDate || a.deadline || a.due_date || ""),
    status: (a.status as "todo" | "in_progress" | "completed") || "todo",
    priority: (a.priority as "low" | "medium" | "high") || "medium",
    submissionLink: String(a.submissionLink || a.link || ""),
  }));
}

function parseCookieString(cookieStr: string): { name: string; value: string }[] {
  return cookieStr.split(";").map((c) => {
    const [name, ...rest] = c.trim().split("=");
    return { name: name.trim(), value: rest.join("=").trim() };
  });
}
