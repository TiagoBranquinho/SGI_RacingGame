# SGI 2023/2024

## Group T08G01
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Henrique Silva         | 202007242 | up202007242@up.pt                |
| Tiago Branquinho         | 202005567 | up202005567@up.pt                |

----

### [TP3](tp3)

#### Menus

Main and end game menus were developed. The first one enables race configuration, regarding player and bot cars, bot difficulty, laps and player name, while the second enables the ability to restart the race or to return to the main menu. Both of these are controllable via the implemented picking mechanism and display information using 3D text.

#### Car

Both available cars are very realistic model 3D objects.

##### Animation

Bot movement was made using keyframe animation. It's orientation along the track was calculated knowing the next point of it's route.
The different dificulties of the bot were distinguished by the duration of the animation. The shorter animation duration, the faster the bot moves through the track.

##### Control

The player controls features acceleration, braking, and automatic deceleration. Reverse gear and a turning capability based on the current velocity (with a cap) was also implemented. All of this took into consideration the deltas influenced by the frame rates, so that the car control runs evenly on different fps values. Wheel forward (or backward) rotation was also implemented based on the velocity of the car, as well as side rotation, when the wheels turn. In order to acheive further realism, the car's turning circle was changed to the centre of the real axel.

##### Colision detection

These detections are constantly being made. The mechanism that detects whether the car or another object is on track is implemented using raycasters, and the rest is made with computations regarding object positions.

The implemented checkpoint system also follows the same process. If one of the checkpoints is missed, or the order of reaching the checkpoints is incorrect the lap won't count, forcing the player to redo the lap and, thus, preventing cut ways.

#### Picking

This technique was used on the main and end game menus, as well as on the game itself. It is very versatile, handling model 3d and mesh objects. Also includes color variations, to illustrate the user the picked elements. Obstacles and cars inside the specific parking lots can be selected.

#### Spritesheets

The informations in the outdoor display (screens) were written using spritesheets: the coordinates on the font texture are calculated through the ASCII code of a caracter. Those informations include the current and the total laps to be done, the player velocity, maximum velocity and current time. Also, any effect that the player is suffering from, due to a colision, is displayed, next to the time remaining for it to end.

#### Particle System

A particle system was applied to create fireworks after the race ends. All fireworks are launched from the same position in random, slighly different, directions. When the particle reachs the end of it's life, it explodes, generating more particles that make for a growing sphere that moves slightly acrosse the sky until it disappears. 

#### Detail Level

Shaders were applied to both obstacles and power-ups. Cones (obstacles) across the track have a pulsating appearence, modifying both they color and appearence through time, while speed ramps (power-ups) have a visual appearence of continuous movenment. 

The information outdoor also includes a shader material on it's screen, adding slight bumps according to it's checkered appearence. 

# Prints

![Menu](./tp3/screenshots/menu.png)
![Start](./tp3/screenshots/start.png)
![Track](./tp3/screenshots/track.png)
![Cone&Outdoor](./tp3/screenshots/cone&outdoor.png)
![Picking](./tp3/screenshots/picking.png)
![EndGame](./tp3/screenshots/endgame.png)

