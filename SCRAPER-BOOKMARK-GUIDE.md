# Capture bookmark: setup guide

The capture bookmark reads the **name, cost, picture, brand and rating** from the product page you are looking at (or the title, poster, type and synopsis from a movie/book page) and files it in Wally MK 2. It runs only in your browser.

The same guide is inside the app: Wishlist or Library tab → "How to set up the capture bookmark".

## Laptop or desktop
1. Show the bookmarks bar: `Ctrl + Shift + B` (Mac: `Cmd + Shift + B`).
2. Open Wally MK 2 → **Wishlist** tab → scroll to **Capture bookmark**.
3. Drag the **Send to Wishlist** button onto the bookmarks bar. Do the same in the **Library** tab for **Send to Library**.
4. Open a product page (Amazon, Flipkart, Myntra, Ajio, Croma, any shop). Wait for it to finish loading and choose the size/variant.
5. Click the bookmark. Wally MK 2 opens with the item saved, including price and picture.

## Phone
1. In the app press **Copy bookmark code**.
2. Bookmark any page, then edit that bookmark: name it `Send to Wishlist` and replace its address with the copied code.
3. On the product page, tap the address bar, type `Send to` and choose the bookmark from the suggestions. (Opening it from the bookmarks menu will not run it on the page.)

## If the app is opened as a local file (not hosted)
The bookmark copies the data instead of opening the app. Go back to the app and press **Paste captured data**.

## If the cost or picture is missing
- Use the product page itself, not a search results page.
- Let the page load fully and pick a variant; many shops show the price only after that.
- Re-drag the button after each app update: the bookmark is a saved copy and does not update itself. **This release has a new, stronger version, so replace the old bookmark.**
- Last resort: press **Modify** on the item and type the price or paste a picture address.

## Pasting a link instead
In "Auto-fetch item" you can paste a product link. With the online lookup ticked, the app asks a public relay for the page and fills name, price and picture. Shops often block relays, so the bookmark is the more reliable route.

## Backend mode (once the server is online and linked)
When the app is linked to your backend (shield button → Cloud), the bookmark stops opening the dashboard and talks to the server instead. **Re-drag the button after linking**, because the bookmark is a saved copy.

| Route | Used when | What happens |
|---|---|---|
| `/api/bookmark-auto` | product page, name and price were read | saved to the `wishlist` collection, pop-up closes itself |
| `/api/bookmark-media-auto` | movie / series / anime / book page | saved with `isMedia: true`; type is set from the address (goodreads → Book, crunchyroll / myanimelist → Anime, series or season → Series, otherwise Movie) |
| `/api/bookmark` | price could not be read | a small form opens: type the price, press Save |
| `/api/bookmark-media` | title could not be read | the same form for the Library |

The dashboard picks the items up at its next sync: entries without `isMedia` go to the Wishlist, entries with it go to the Library.

You can also call the manual route with only a link, for example from a phone share shortcut:
`https://YOUR-SITE/api/bookmark?url=PAGE-ADDRESS&key=YOUR-KEY` — the server tries to read the page itself and pre-fills the form.

Note: if you set a `WALLY_KEY`, it is stored inside the bookmark. Anyone who can open your bookmarks can read it.
