let fs = require('fs');
let babylon = require('babylon');
let traverse = require('babel-traverse').default;
let {transformFromAst} = require('babel-core');
let path = require('path');
let ID = 1;

// let content = fs.readFileSync('../async.js', 'utf-8');
// let ast = babylon.parse(content, {
//     sourceType: 'module'
// });

// console.log(ast)
// console.log(content)

function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = babylon.parse(content, {
        sourceType: 'module'
    });
    const dependencies = [];
    traverse(ast, {
        ImportDeclaration: ({node}) => {
            dependencies.push(node.source.value)
        }
    });
    const id = ID ++;
    const {code } = transformFromAst(ast, null, {
        presets: ['env']
    });
    const customCode = loader(filename, code);
    return {
        id,
        filename,
        dependencies,
        code
    };
}

function loader(filename, code) {
    if (/entry/.test(filename)) {
      console.log('this is loader ')
    }
    return code
  } 

function createGraph(entry) {
    const mainAsset = createAsset(entry);
    const queue = [mainAsset];
    for(const asset of queue) {
        asset.mapping = {};
        const dirname = path.dirname(asset.filename);
        asset.dependencies.forEach(relativePath => {
            const absolutePath = path.resolve(dirname, relativePath);
            const child = createAsset(absolutePath);
            asset.mapping[relativePath] = child.id;
            queue.push(child);
        });
    }
    return queue;
}

function build(graph) {
    let modules = '';
    graph.forEach(mod => {
        modules += `${mod.id}:[
            function(require, module, exports) {
                ${mod.code}
            },
            ${JSON.stringify(mod.mapping)}
        ]`;
    });
    const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(name) {
          return require(mapping[name]);
        }

        const module = { exports : {} };

        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    })({${modules}})
  `;

    return result;
}

const graph = createGraph('../async.js');
const result = build(graph);
console.log(result)