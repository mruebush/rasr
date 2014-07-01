# RASR - A HTML5, multiplayer, tilebased game

Cooperative multiplayer game where players can build diverse maps or explore the world and fight creatures. 

We wanted to create an environment where players can express themselves through the art of map editing, while being able to explore and see what other users have created. This was also a good opportunity to integrate a wide range of technologies, from sophisticated frameworks such as Angular and Phaser.io, to cutting edge real-time engines like Socket.io

Players can explore the world, fight creatures, gain rewards, interact with other players and their surroundings.
They also have the possibility to build and customize the world.

Using the arrow keys, the player is able to move through their surroundings and fight enemies by shooting fireballs with the space bar. Also, by clicking on the Earth icon in the bottom-left corner, the player can edit or create new maps.

## Getting Started

To get you started you can simply clone the rasr and rasr-server repository and install the dependencies with bower and npm

### Prerequisites

You need git to clone the rasr & rasr-server repository. You can get it from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test rasr. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone rasr

Clone the rasr repository using [git][git]:

```
git clone https://github.com/dokko1230/rasr.git
cd rasr
```

### Install Dependencies

We have two kinds of dependencies in this project: phaser and angular framework code.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

*Note that the `bower_components` folder would normally be installed in the root folder but
rasr changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
node server.js
```

Now browse to the app at `http://localhost:9000/`.

## Testing

TODO: WRITE TESTS

## Contact

For more information on RASR please check out http://rasr.azurewebsites.net/about

[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[protractor]: https://github.com/angular/protractor
[jasmine]: http://pivotal.github.com/jasmine/
[karma]: http://karma-runner.github.io
[travis]: https://travis-ci.org/
[http-server]: https://github.com/nodeapps/http-server