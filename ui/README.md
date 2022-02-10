# ui

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Provide minimum required data (layout and components)

##### In this example we provide at least one field with one col

```javascript
<script>
      window.drupalSettings = {};

      window.drupalSettings.plb = [
        {
          mountPoint: "#plb-app",
          layout: {
            rows: [
              {
                cols: [
                  {
                    components: [],
                  },
                ],
              },
            ],
          },
          components: [
            {
              id: "slider-1",
              label: "Slider hero",
              preview:
                "<h1>This is a preview for the slider</h1><p>In this case is just a text sample but in here you may put a simplified shape of the component of even an image.</p>",
            },
          ],
        },
      ];
    </script>
```

##### In this example we provide some initially allocated fields

```javascript
<script>
      window.drupalSettings = {};

      window.drupalSettings.plb = [
        {
          mountPoint: "#plb-app",
          layout: {
            rows: [
              {
                cols: [
                  {
                    components: [],
                  },
                  {
                    components: [],
                  },
                ],
              },
            ],
          },
          components: [
            {
              id: "slider-1",
              label: "Slider hero",
              preview:
                "<h1>This is a preview for the slider</h1><p>In this case is just a text sample but in here you may put a simplified shape of the component of even an image.</p>",
            },
            {
              id: "image-with-text-2",
              label: "Image of people dancing with an intro",
              preview:
                "<h3>This is a preview for the text component</h3><p>In this case is just a text sample but in here you may put a simplified shape of the component of even an image.</p>",
            },
            {
              id: "no-prev-comp",
              label: "Desde JSON Component without preview.",
              preview: "",
            },
          ],
        },
        {
          mountPoint: "#plb-app2",
          layout: {
            rows: [
              {
                cols: [
                  {
                    components: [],
                  },
                  {
                    components: [],
                  },
                  {
                    components: [],
                  },
                  {
                    components: [],
                  },
                  {
                    components: [],
                  },
                  {
                    components: [],
                  },
                ],
              },
            ],
          },
          components: [
            {
              id: "slider-1",
              label: "Slider hero",
              preview:
                "<h1>This is a preview for the slider</h1><p>In this case is just a text sample but in here you may put a simplified shape of the component of even an image.</p>",
            },
          ],
        },
      ];
    </script>
```
