// Compiles the ESM-only test dependencies (nock >= 15 and its interceptors) to CommonJS so Jest can require them.
const crypto = require('crypto');
const ts = require('typescript');

const IMPORT_META_URL = /\bimport\.meta\.url\b/g;

module.exports = {
  getCacheKey(sourceText, sourcePath) {
    return crypto.createHash('sha256').update(ts.version).update(sourcePath).update(sourceText).digest('hex');
  },
  process(sourceText, sourcePath) {
    const { outputText, sourceMapText } = ts.transpileModule(
      sourceText.replace(IMPORT_META_URL, "require('url').pathToFileURL(__filename).href"),
      {
        // a .mjs file name would make TypeScript keep the ESM syntax
        fileName: sourcePath.replace(/\.mjs$/, '.js'),
        compilerOptions: {
          allowJs: true,
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
          sourceMap: true,
        },
      },
    );
    return { code: outputText, map: sourceMapText };
  },
};
