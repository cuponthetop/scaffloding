# Scaffoldings
Scaffolding for various project settings

# Organization Rules (except gulp project)

## Directory Rules

1. **First** level represents functional categorization of various projects
2. **Second** level represents language/framework-combination
3. **Third** level represents language if the second level described framework

## Project Rules

- Every directory should have its own **README.md**
- Every directory would have **start.sh** for basic startup settings
- Available projects will contain **travis.yaml** or any possible CI configuration
- Hopefully, every project may have **javadoc-style** documentation

# Outline
```
api         ... When you are going to build up API using es7 or typescript
Basic       ... If you really want to develop something that
                doesn't go inside any of these categories with Node.js?
Datastore   ... When you need to plug in datastorage to your project
                and want to keep using the same langauge environment
Front       ... Front-end project with the specified framework (I prefer angular2, so...)
Gulp        ... gulp tasks for various kind of jobs
                separated to different directories just so
                to make it hard for you to find fittest if there's any
Log         ... Logging components written in various languages
Test        ... Some basic set-ups and sample tests for various language/framework
```

# Detailed List
```
api/
... es7     ... babel/es7 (async/await)
... ts      ... ts/typings/typescript
basic/
... es7     ... babel/es7 (async/await)
... ts      ... ts/typings/typescript
datastore/
... es7     ... babel/es7 (async/await)
... ts      ... ts/typings/typescript
front/
... a2-e-p  ... angular2-express-pug stack for front-end using typescript
gulp/
... apidoc  ... build apidoc based on apidoc style comments
... db      ... initialization of db via gulp
... es7     ... babel/es7 compile and run
... jsdoc   ... build doc based on javadoc style comments
... ts      ... ts/typings/typescript compile and run
log/
... es7     ... babel/es7 (async/await)
... ts      ... ts/typings/typescript
test/
... es7     ... babel/es7 (async/await)
... ts      ... ts/typings/typescript
... wd/     ... e2e test with WebDriver
...... js   ... WebDriver using plain old js
...... es7  ... WebDriver using es7
...... ts   ... WebDriver using typescript
```

#
Author - cuponthetop