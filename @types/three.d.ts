declare module 'three/examples/jsm/loaders/GLTFLoader' {
    import { Loader } from 'three';
    export class GLTFLoader extends Loader {
      load(url: string, onLoad: (gltf: any) => void, onProgress?: (event: ProgressEvent) => void, onError?: (error: Error) => void): void;
    }
  }
  
  declare module 'three/examples/jsm/controls/OrbitControls' {
    import { Camera, EventDispatcher, MOUSE, Vector2 } from 'three';
    export class OrbitControls extends EventDispatcher {
      constructor(object: Camera, domElement?: HTMLElement);
      // Add other methods and properties as needed
      update(): void;
    }
  }