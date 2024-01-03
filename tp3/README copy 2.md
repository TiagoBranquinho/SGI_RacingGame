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
DIFICULDADES DO BOT
ANIMACAO POR CHAVES
???

##### Control

The player controls features acceleration, braking, and automatic deceleration. Reverse gear and a turning capability based on the current velocity (with a cap) was also implemented. All of this took into consideration the deltas influenced by the frame rates, so that the car control runs evenly on different fps values. Wheel forward (or backward) rotation was also implemented based on the velocity of the car, as well as side rotation, when the wheels turn. In order to acheive further realism, the car's turning circle was changed to the centre of the real axel.

##### Colision detection

These detections are constantly being made. The mechanism that detects whether the car or another object is on track is implemented using raycasters, and the rest is made with computations regarding object positions.

INCLUIR EXPLICACAO DE DETECAO DE CHECKPOINTS E COMO ISSO INFLUENCIA AS VOLTAS --> PODE REQUERER ALTERACAO DA LINHA ACIMA.

#### Picking

This technique was used on the main and end game menus, as well as on the game itself. It is very versatile, handling model 3d and mesh objects. Also includes color variations, to illustrate the user the picked elements. Obstacles and cars inside the specific parking lots can be selected.

#### Spritesheets

The informations in the outdoor display (screens) were written using spritesheets: the coordinates on the font texture are calculated through the ASCII code of a caracter. Those informations include the current and the total laps to be done, the player velocity, maximum velocity and current time. Also, any effect that the player is suffering from, due to a colision, is displayed, next to the time remaining for it to end.

#### Particle System

FOGO DE ARTIFICIO

#### Detail Level

OBSTACULOS E POWERUPS --> SHADERS

OUTDOOR DISPLAY

# Prints (falta)

