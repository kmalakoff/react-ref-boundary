import { importMapsPlugin } from '@web/dev-server-import-maps';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';

export default createConfig({
  port: 9013,
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            react: 'https://esm.sh/react@19.2.3?dev',
            'react-dom': 'https://esm.sh/react-dom@19.2.3?dev',
            'react-dom/client': 'https://esm.sh/react-dom@19.2.3/client.js?dev',
          },
        },
      },
    }),
  ],
});
