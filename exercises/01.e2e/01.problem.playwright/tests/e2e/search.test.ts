// 🐨 import expect and test from @playwright/test

// 🐨 create your test here, you'll need the page fixture.
//   🐨 go to the home page (💰 "/")
//   🐨 fill in the search box with "kody" (💰 it's implicit role is "searchbox" and it's named "search")
//   🐨 click the search button (💰 it's named "search")
//   🐨 wait for the URL to be "/users?search=kody" (💰 page.waitForURL)
//   🐨 assert that the text "Epic Notes Users" is visible (💰 don't forget to add "await")
//   🐨 get the list of users and assert that there's only one user
//     💰 you're looking for a "list" element, but we've got others on the page
//     you can chain queries together like this: page.getByRole('main').getByRole('list')
//     then from there, you can chain another query to get the "listitems" inside the list
//   🐨 assert that the image with alt text "kody" is visible (💰 getByAltText)
//   🐨 fill in the search box with "__nonexistent__" (💰 that shouldn't match anyone)
//   🐨 click the search button
//   🐨 wait for the URL to be "/users?search=__nonexistent__"
//   🐨 get the list of users and assert that there are no users (💰 query for the listitem and assert not.toBeVisible())
//   🐨 assert that the text "no users found" is visible
