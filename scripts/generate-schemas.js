/**
 * Generates JSON Schemas from annotated Typescript types in ./app/types/*
 */
const tsj = require("ts-json-schema-generator")
const fs = require("fs")
const path = require("path")

const typesDir = path.resolve("./app/types")

// Field defns: https://github.com/vega/ts-json-schema-generator/blob/master/src/Config.ts
const defaultGeneratorConfig = {
  path: typesDir,
  tsconfig: path.resolve("tsconfig.json"),
  type: "User",
  // ajv isn't fond of #ref fields, so discourage as much as possible
  topRef: false,
  encodeRefs: false,
  expose: "none",
}

fs.readdir(typesDir, (err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".ts") || file === "index.ts") {
      return
    }

    const typePath = path.join(typesDir, file)
    console.log("Reading types from", file)

    const entityName = file.substr(0, file.length - 3)

    // Uppercase first letter to match the exported type name
    const entity = entityName[0].toUpperCase() + entityName.substr(1)

    console.log(`Extracting entity "${entity}"...`)
    const config = { ...defaultGeneratorConfig, path: typePath, type: entity }
    try {
      const schema = tsj.createGenerator(config).createSchema(config.type)
      const schemaString = JSON.stringify(schema, null, 2)

      const outputFile = `${entity}.schema.json`
      const outputPath = path.join(typesDir, outputFile)
      console.log("Writing schema into", outputFile)

      fs.writeFile(outputPath, schemaString, (err) => {
        if (err) throw err
      })
    } catch (ex) {
      console.log(`  Skipping ${entity}: ${ex.message}`)
    }
    console.log()
  })
})
