# SGI 2023/2024

## Group T08G01
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Henrique Silva         | 202007242 | up202007242@up.pt                |
| Tiago Branquinho         | 202005567 | up202005567@up.pt                |

----

## Projects

### [TP1 - ThreeJS Basics](tp1)

 - This project represents a room with a table, a window and some decoration.
 - Since it is someone's birthday, there are balloons, and most importantly a birthday cake.
 - The illumination consists on a light at the top, the candle's flame and the sunset light coming from the window.
 - Every object on the scene receives and casts shadows.
 - There is a happy birthday mode in the interface, which turns the lights off. Initially this also controlled the existance of the candle's flame (and consequently its light), which would enrich the project in our opinion. However, since the candle and its light were a main requirement following our approach, we decided to remove that feature.
 - As the strong points of this project, we can inumerate the balloons, which demonstrate creativity, the flower and its jar, and the reality effect achieved from the light coming form the window, as well as from all the shadows developed.

 ![Scene_1](./tp1/screenshots/scene_1.png)
 ![Scene_2](./tp1/screenshots/scene_2.png)
 ![Scene_HBD](./tp1/screenshots/hbd_mode.png)

-----

### [TP2 - ...](tp2)
- (items briefly describing main strong points)

----

### [TP3 - ...](tp3)
- (items briefly describing main strong points)

### [TP2](tp2)
 
#### Scene Graph

The parsing approach can be seen as a mix between top-down and bottom-up processing. It starts by interpreting the XML file's structure from the root level, examining global settings, textures, materials, cameras, nodes, and lights. Then, when specific elements like textures, materials, or geometries for objects in the scene are encountered, it processes these elements individually, creating specific objects based on the data available. 
The 3D scene is constructed by generating objects, applying materials, setting positions, and other attributes based on the parsed specifications in the XML file.

#### Detail Level

LODs, which allow to have multiple degrees of detail, are supported in the parser and implemented in the created XML scene.

#### Advanced Textures

The parser support all types of required textures, that is: sky boxes, mip-maps, bump-textures, video-textures. All of these are implemented in the XML scene.

#### Visualization in Wireframe

Wireframe materials are supported by the parser and is implemented in the XML in the line supporting the disco ball.

![Wireframe](./tp2/screenshots/wireframe.png)

#### Buffer Geometry

Buffer geometry is supported by the parser allowing the construction of polygons and is implemented in the XML scene in the "No Smoking" sign.

#### GUI

A GUI that allows to move and modify cameras, lights and different depth nodes was implemented.

#### XML Scene

The XML scene showcases a night bar, constructed by a wood floor and four brick walls with bump textures, one of them containing a neon sign emitting light. The bar is also lightened by two pointlights and two spotlights. Inside there can be seen two benches, a table, a counter and a shelf with wood textures, as well as four bottles constructed with nurbs, a disco ball with a video texture, a dart target with bump textures and mip-maps, three pints with video textures and bump textured foam, three stools, constructed using a 3D model, and a "No Smoking" sign, constructed using buffer geometry to design the polygon that constitures the background of the sign. The bar is encapsulated by a sky box with a starry night and, when zooming out, objects with nurbs will be replaced with less detailed primitives, while objects of smaller dimensions will gradually disappear.   

 ![Scene_v2](./tp2/screenshots/scene_v2.png)
 ![Scene_v2.2](./tp2/screenshots/scene_v2_2.png)
 ![Scene_v2.3](./tp2/screenshots/scene_v2_3.png)
 ![LODs](./tp2/screenshots/lods.png)



