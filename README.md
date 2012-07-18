# Tire

Tire is a lightweight JavaScript library for modern browsers. The syntax is inspired from jQuery.

Tire is under development right now and have no stable version.

## Browser support 

* Chrome
* Safari 4
* Internet Explorer 8
* Firefox 3.5
* Opera 10.5

Mobile browsers will be added later.

#### Older browsers

Tire may work in older browsers but is not tested in older than the above.

Browsers without `JSON` support will probably work great but `$.parseJSON` will just return null. There's a comment about how this can be fixed in the source code. Modern browsers should support `JSON`.

## Build

```sh
npm install -g grunt
make
```

On Windows
  
```sh
npm install -g grunt
grunt.cmd
```

## Test

  Build Tire and open `test/index.html`
  
## Contribute

Everyone is welcome to contribute with patches, bug-fixes and new features

1. create an [issue](https://github.com/Frozzare/tire/issues) on github so the community can comment on your idea
2. fork `tire` in github
3. create a new branch `git checkout -b my_branch`
4. create tests for the changes you made
5. make sure you pass both existing and newly inserted tests
6. commit your changes
7. push to your branch `git push origin my_branch`
8. create a pull request