import { blue, gray, yellow } from 'kolorist';

export const get_liquid_comment = (comment: string) => {
  return `{% comment %}
${comment}
{% endcomment %}\n`;
};

export const liquid_section_id = 'shopify-theme-react-{{ section.id }}';

export const get_app_root_tag = (html: string) => {
  return `<div id="${liquid_section_id}" data-server-rendered="true">${html}</div>`;
};

export const generate_build_banner = () => {
  return `*  build date ${new Date().toLocaleString()}`;
};

export const get_comment = (comment: string) => {
  return `/**
${comment}
*/\n`;
};

export const generate_release_liquid = ({
  html,
  script_name,
  style_name,
  schema,
}: {
  html: string;
  script_name: string;
  style_name: string;
  schema?: string;
}) => {
  let liquid = `<link href="{{ "${style_name}" | asset_url }}" rel="stylesheet" type="text/css" >
${get_app_root_tag(html)}
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19.2.0",
    "react-dom/": "https://esm.sh/react-dom@19.2.0/"
  }
}
</script>
<script src="{{ "${script_name}" | asset_url }}&id=${liquid_section_id}" type="module" data-section-id="${liquid_section_id}" data-section-settings="{{ section.settings | json }}"></script>\n`;

  if (schema) liquid += `{% schema %} ${schema} {% endschema %}`;

  return liquid;
};

export function build_log(text: string, count?: number) {
  console.log(`\n${gray('[shopify-theme-react]')} ${yellow(text)}${count ? blue(` (${count})`) : ''}`);
}
