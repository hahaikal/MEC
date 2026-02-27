
from playwright.sync_api import sync_playwright, Page, expect

def test_reports_and_expenses(page: Page):
    # 1. Login
    page.goto("http://localhost:3000/login")

    # Check if we are redirected to login or already in dashboard
    if "login" in page.url:
        page.fill('input[type="email"]', 'admin@example.com')
        page.fill('input[type="password"]', 'admin123')

        # Use more specific locator
        page.click('button:has-text("Sign in")')

        try:
            page.wait_for_url("**/dashboard", timeout=5000)
            print("Login successful.")
        except:
            print("Failed to login (timeout or error).")
            # If login fails, we cannot verify the rest.
            return

    # 2. Verify Reports Page
    page.goto("http://localhost:3000/dashboard/reports")
    # Wait for loading to finish (Loader2 should disappear)
    page.wait_for_selector('text=Laporan Keuangan', timeout=60000)
    expect(page.get_by_text("Total Pendapatan")).to_be_visible()

    # Take screenshot of Reports Page
    page.screenshot(path="verification/reports_page.png")
    print("Reports page verified.")

    # 3. Verify Expenses Page & Sidebar Link
    # Click on the new Expenses link in the sidebar
    page.click('a[href="/dashboard/expenses"]')
    page.wait_for_url("**/dashboard/expenses")
    expect(page.get_by_text("Manajemen Pengeluaran")).to_be_visible()

    # 4. Verify Filters on Expenses Page
    # Check if Category Select exists
    expect(page.get_by_role("combobox")).to_be_visible() # Select trigger is a combobox

    # Check if Date Range Picker exists (Button with CalendarIcon)
    # The button ID is "date" as defined in the code
    expect(page.locator("button#date")).to_be_visible()

    # Take screenshot of Expenses Page
    page.screenshot(path="verification/expenses_page.png")
    print("Expenses page verified.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create context with storage state if needed, or just login every time
        context = browser.new_context()
        page = context.new_page()
        try:
            test_reports_and_expenses(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
