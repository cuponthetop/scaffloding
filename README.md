# Scaffoldings
Scaffolding for various project settings

# Organization Rules (except gulp project)

## Directory Rules

1. **First** level represents functional categorization of various projects
2. **Second** level represents language/framework-combination
3. **Third** level represents language if the second level described framework

## Project Rules

- Every directory should have its own **README.md**
- Available projects will contain **travis.yaml** or any possible CI configuration
- Hopefully, every project may have **javadoc-style** documentation

# Outline
```
api         ... When you are going to build up API using typescript
Basic       ... A scaffolding for all other Node.js including ts-node settings
                and mocha-istanbul test setting in typescript.
Datastore   ... When you need to plug in datastorage to your project
                and want to keep using the same langauge environment
Front       ... Front-end project with the specified framework (I prefer angular2, so...)
Gulp        ... gulp tasks for various kind of jobs
                separated to different directories just so
                to make it hard for you to find fittest if there's any
Websocket   ... Basic Websocket server
```

# Detailed List
```
api/
... ts      ... ts/typings/typescript
basic/
... ts      ... ts/typings/typescript
datastore/
... ts      ... ts/typings/typescript
front/
... a2-e-p  ... angular2-express-pug stack for front-end using typescript
gulp/
... apidoc  ... build apidoc based on apidoc style comments
... db      ... initialization of db via gulp
... jsdoc   ... build doc based on javadoc style comments
... ts      ... ts/typings/typescript compile and run
websocket/
... ts      ... ts/typings/typescript
```

#
Author - cuponthetop