import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.open()
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.open();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Top', 'Front' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()

        // add a folder to the gui interface for the candle
        const candleFolder = this.datgui.addFolder( 'Candle' );
        candleFolder.add(this.contents, 'candleEnabled', true).name("enabled").onChange(() => {this.contents.enableCandle()});
        // note that we are using a property from the contents object 
        //boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        candleFolder.open()

        // add a folder to the gui interface for the cake
        const cakeFolder = this.datgui.addFolder( 'Cake' );
        cakeFolder.add(this.contents, 'cakeSliceEnabled', true).name("slice enabled").onChange(() => {this.contents.enableCakeSlice()});
        cakeFolder.add(this.contents, 'cakeBigPortionEnabled', true).name("big portion enabled").onChange(() => {this.contents.enableBigCake()});

        // note that we are using a property from the contents object 
        //boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        cakeFolder.open()

        // add a folder to the gui interface for the plate
        const plateFolder = this.datgui.addFolder( 'Plate' );
        plateFolder.add(this.contents, 'plateEnabled', true).name("enabled").onChange(() => {this.contents.enablePlate()});

        // note that we are using a property from the contents object 
        //boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        plateFolder.open()


        // add a folder to the gui interface for the table
        const tableFolder = this.datgui.addFolder( 'Table' );
        tableFolder.add(this.contents, 'tableEnabled', true).name("enabled").onChange(() => {this.contents.enableTable()});

        // note that we are using a property from the contents object 
        //boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        tableFolder.open()

        // add a folder to the gui interface for the decoration
        const decorationFolder = this.datgui.addFolder( 'Decoration' );
        decorationFolder.add(this.contents, 'decorationEnabled', true).name("enabled").onChange(() => {this.contents.enableDecoration()});

        // note that we are using a property from the contents object 
        //boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        decorationFolder.open()




        
    }
}

export { MyGuiInterface };