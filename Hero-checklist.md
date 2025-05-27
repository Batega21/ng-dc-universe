# DC Universe

## Epics

1. Develop Frontend architecture.
2. Develop Basic home page.
3. Show Heroes.

## Main Features Stories

1. Add a new Hero. √
2. View all Heroes. √
3. View Hero details by ID. √
4. Filter Heroes with parameters. √
5. Edit Hero. √
6. Delete Hero. √
7. Unit Test.

## Functionality

1. Show a paginated list for all Heroes.
2. A search filter input where shows the selected Hero or Heroes.
3. Each Hero must have an "Edit" button.
   1. A form page with "Edit" the Hero data.
   2. A confirmation dialog for "Edit" action.
   3. A notification snack bar.
4. Each Hero must have a "Delete" button.
   1. A form page with "Delete" the Hero data.
   2. A confirmation dialog for "Delete" action.
   3. A notification snack bar.
5. An "Add Button" to add a new hero.
   1. A form page with "Add" the new Hero data.
   2. A confirmation dialog for "Add" action.
   3. A notification snack bar.

## TODOs

- Hero power search filter. √
- Notification snack Bar. √
- Pagination. √
- Unit Test.
- Powers checkbox into Arrays. √
- Offline data storage (e.g., using IndexedDB or localStorage). √
- Theme switcher (dark/light). Optional
- Favorite hero with toggle. Optional
- Hero stats chart with ng2-charts or D3.js. Optional

## Bugs

- Pagination: I don't see any more heroes when I flip through the pages. If I increase the list of heroes per page, there are no changes.
- After filtering and showing the filtered hero, I return to home and see all the heroes again.
- After creating a hero, I return to home and see all the heroes again.
- When creating a hero, I can only select one power.
- When editing and creating a hero, the edit button would be better if it said "save."
- Fix the GitHub URL.
- With search, the magnifying glass doesn't work if you haven't done anything.
- I edited Superman, went to the magnifying glass, and the change doesn't appear.
- If the hero doesn't exist, show the snackBar and redirect to home.
- When filtering by man and selecting Batman, it shows a red card.
