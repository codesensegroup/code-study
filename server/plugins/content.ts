import * as path from 'path';
import { visit } from 'unist-util-visit';
import { z } from "zod";

const baseUrl = z
  .string()
  .regex(/\/.*/, "A prefix base url should start with a slash /")
  .default("/")
  .parse(process.env.BASE_URL);

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:afterParse', (file: any) => {     
    if (file._id.endsWith('.md')) {
      visit(file.body, (n: any) => n.tag === 'img', (node) => {
        if (node.props && node.props.src.startsWith('images/')) {
          node.props.src = path.join(baseUrl, node.props.src);
          console.log(node, node.props.src);
        }
      })
    }
  })
})
