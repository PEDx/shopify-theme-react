import { blue, gray, yellow } from 'kolorist';

export const get_liquid_comment = (comment: string) => {
  return `{% comment %}
${comment}
{% endcomment %}\n`;
};

export const get_app_root_tag = (html: string) => {
  return `<div id="{{ section.id }}" ata-server-rendered="true">${html}</div>`;
};

export const generate_build_banner = () => {
  return `*  build date ${new Date().toLocaleString()}\n`;
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
<script src="umd/react.development.js" defer></script>
<script src="umd/react-dom.development.js" defer></script>
<script src="{{ "${script_name}" | asset_url }}" type="text/javascript" defer fetchpriority="high"></script>\n`;

  if (schema) liquid += `{% schema %} ${schema} {% endschema %}`;

  return liquid;
};

export function build_log(text: string, count?: number) {
  console.log(`\n${gray('[shopify-theme-react]')} ${yellow(text)}${count ? blue(` (${count})`) : ''}`);
}
