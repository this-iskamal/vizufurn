import React from 'react';
import {
  ViroARScene,
  ViroMaterials,
  Viro3DObject,
  ViroSpotLight,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroARPlaneSelector,
} from '@reactvision/react-viro';

// Define materials
ViroMaterials.createMaterials({
  grid: {
    lightingModel: 'Lambert',
    diffuseTexture: require('../assets/stool/wooden_stool_color.png'),
  },
});

const InitialScene = () => {
  return (
    <ViroARScene>
      {/* Ambient Light for overall illumination */}
      <ViroAmbientLight color="#ffffff" intensity={200} />

      {/* AR Plane Selector to position the stool on a detected plane */}
      <ViroARPlaneSelector>
        {/* 3D Object */}
        <Viro3DObject
          position={[0, 0, 0]} // Relative position on the plane
          scale={[0.2, 0.2, 0.2]} // Fixed scale
          source={require('../assets/stool/WoodenStool.obj')}
          resources={[require('../assets/stool/WoodenStool1.mtl')]}
          type="OBJ"
          materials={['grid']}
        />
      </ViroARPlaneSelector>

      {/* Spotlight for shadow and highlights */}
      <ViroSpotLight
        innerAngle={5}
        outerAngle={25}
        direction={[0, -1, 0]}
        position={[0, 3, 1]}
        color="#ffffff"
        castsShadow={true}
      />
    </ViroARScene>
  );
};

const ARView = () => {
  return <ViroARSceneNavigator initialScene={{ scene: InitialScene }} />;
};

export default ARView;
