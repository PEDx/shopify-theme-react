import { liquid_section_id } from './utils.ts';

export const generate_debug_html = (html: string, script_name: string, style_name: string) => {
  return `
   <html>
    <head>
      <link href="./${style_name}" rel="stylesheet" type="text/css" >
    </head>
    <body>
      <div id="${liquid_section_id}" data-server-rendered="true">${html}</div>
      <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@19.2.0",
          "react-dom/": "https://esm.sh/react-dom@19.2.0/"
        }
      }
      </script>
      <script src="./${script_name}?id=${liquid_section_id}" type="module" data-section-id="${liquid_section_id}" data-section-settings="{}"></script>
    </body>
   </html>
  `;
};
