import React, {useState} from 'react';
import {
  ViroARScene,
  ViroMaterials,
  Viro3DObject,
  ViroSpotLight,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroARImageMarker,
  ViroARTrackingTargets,
} from '@reactvision/react-viro';

// Define materials
ViroMaterials.createMaterials({
  grid: {
    lightingModel: 'Lambert',
    diffuseTexture: require('../assets/sofa/wooden_table_color.png'), // Use local texture file
  },
});

// Define AR Tracking Targets
ViroARTrackingTargets.createTargets({
  markerTarget: {
    source: require('../assets/woodentable/marker.jpg'), // Use local marker image
    orientation: 'Up',
    physicalWidth: 2,
  },
});

const InitialScene = ({productModel}) => {
  const [scale, setScale] = useState([1, 1, 1]);


  const handlePinch = (pinchState, scaleFactor) => {
    if (pinchState === 3) {
      // Pinch gesture ends
      setScale(prevScale => prevScale.map(value => value * scaleFactor));
    }
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />

      <ViroARImageMarker target="markerTarget">
        <Viro3DObject
          position={[0, 0, 0]}
          scale={scale}
          source={require('../assets/sofa/WoodenTable.obj')} // Use local OBJ file
          resources={[
            require('../assets/sofa/WoodenTable.mtl'), // Use local MTL file
          ]}
          type="OBJ"
          materials={['grid']}
          onPinch={handlePinch}
        />

        <ViroSpotLight
          innerAngle={5}
          outerAngle={25}
          direction={[0, -1, 0]}
          position={[0, 3, 1]}
          color="#ffffff"
          castsShadow={true}
        />
      </ViroARImageMarker>
    </ViroARScene>
  );
};

const ARView = ({route}) => {
  const {product} = route.params;
  const {model} = product;
console.log(model.product.name)
 

  return (
    <ViroARSceneNavigator
      initialScene={{
        scene: () => <InitialScene productModel={model} />, // Pass model data as props to InitialScene
      }}
    />
  );
};

export default ARView;
