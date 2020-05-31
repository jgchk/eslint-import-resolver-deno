# eslint-import-resolver-deno
[![deno](https://img.shields.io/badge/deno-161e2e?style=flat-square&logo=deno)](https://deno.land/)
[![license](https://img.shields.io/badge/license-GPL--3.0-orange?style=flat-square)](https://choosealicense.com/licenses/gpl-3.0/)
[![npm](https://img.shields.io/npm/v/eslint-import-resolver-deno?style=flat-square)](https://www.npmjs.com/package/eslint-import-resolver-deno)

Deno-style module resolution plugin for [`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import) 🦕

## install
```bash
# npm
npm i -D eslint-plugin-import eslint-import-resolver-deno

# yarn
yarn add -D eslint-plugin-import eslint-import-resolver-deno
```

## config
add the following to your `.eslintrc`:
```javascript
{
  "plugins": ["import"],
  "settings": {
    "import/resolver": "eslint-import-resolver-deno"
  }
}
```

### import maps
to use an [import map](https://deno.land/manual/linking_to_external_code/import_maps), specify the path to your import_map.json in settings:
```javascript
"import/resolver": {
  "eslint-import-resolver-deno": {
    "importMap": "./path/to/import_map.json"
  }
}
```

## contributing
- pull requests are welcome!
- for major changes, open an issue first to discuss what you would like to change
