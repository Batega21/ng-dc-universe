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

- √√ Pagination: I don't see any more heroes when I flip through the pages. If I increase the list of heroes per page, there are no changes. √√
- √√ After filtering and showing the filtered hero, I return to home and see all the heroes again. √√
- √√ After creating a hero, I return to home and see all the heroes again. √ **** CHECK I cannot see all heroes when I save my new hero added. Pagination shows 0 of 0. if I refreshing the page I see all heroes √√
- √√ When creating a hero, I can only select one power. √ **** CHECK I can select more powers but when I check heroes's information I cannot see power attributes assigned
- √√ When editing and creating a hero, the edit button would be better if it said "save." √ √
- √√ Fix the GitHub URL. √ √
- √√ With search, the magnifying glass doesn't work if you haven't done anything. √ √
- √√ I edited Superman, went to the magnifying glass, and the change doesn't appear. √ √
- √√ When filtering by man and selecting Batman, it shows a red card. √ √

## Checklist

• √√ Registrar un nuevo super heroe. √
• √√ Consultar todos los súper héroes. √
• √√ Consultar un único súper héroe por id. √
• √√ Consultar todos los súper héroes que contienen, en su nombre, el valor de un parámetro enviado en la petición. Por ejemplo, si enviamos “man” devolverá “Spiderman”, “Superman”, “Manolito el fuerte”, etc √
• √√ Modificar un súper héroe. √
• √√ Eliminar un súper héroe. √
• √√ Test unitario de este servicio.

- Se deberá crear un Componente que, a partir del servicio anterior:
  • √√ Mostrará una lista paginada de héroes donde aparecerán botones de añadir, editar y borrar. √
  • √√ Encima de esta lista paginada, se mostrará un input para filtrar por el héroe seleccionado. √
  • √√ Al pulsar el botón de añadir se generará un formulario vacío con las validaciones que se estimen oportunas. Después de dar de alta el nuevo héroe se volverá a la lista paginada.
  • √√ Al pulsar el botón de edición se generará un formulario con los datos del héroe seleccionado y se permitirá modificar su información. Una vez editado se deberá volver a la lista paginada.
  • √√ Al pulsar el botón de borrar, se preguntará si se está seguro que se desea borrar el héroe y, al confirmarlo, lo borrará. √
  • √√ Test unitario de este componente.

## Puntos a tener en cuenta:

• √√ La información de súper héroes se guardará dentro del servicio. (No hace falta un backend).
• √√ Se valorarán las soluciones propuestas para cada punto, el modelo de datos y formato del código.
• √√ La prueba se debe presentar en un repositorio de Git. Se sugiere ser ordenado y descriptivos con los commits. Al momento de la entrega indicar el Repositorio.

## Puntos opcionales de mejora:

• √√ Se puede utilizar Angular Materia.
• √√ Rutas y navegación de la página.
• √√ Interceptor para mostrar un elemento “loading” mientras se realiza alguna operación como “borrado” o “edición”.
• Directiva para que al crear o editar en la caja de texto del nombre del héroe, siempre se muestre en mayúscula.
