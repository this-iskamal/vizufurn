import React, {useEffect, useState} from 'react';
import {
  ViroARScene,
  ViroMaterials,
  Viro3DObject,
  ViroSpotLight,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroButton,
} from '@reactvision/react-viro';



// Define materials
ViroMaterials.createMaterials({
  grid: {
    lightingModel: 'Lambert',
  
  },
});

// Define AR Tracking Targets
ViroARTrackingTargets.createTargets({
  markerTarget: {
    source: require('../assets/woodentable/marker.jpg'),
    orientation: 'Up',
    physicalWidth: 2,
  },
});

const InitialScene = ({productModel}) => {
  const [scale, setScale] = useState([1, 1, 1]);
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  useEffect(() => {
    // Dynamically set the diffuse texture material after the model is loaded
    if (productModel.materialFile) {
      ViroMaterials.createMaterials({
        grid: {
          lightingModel: 'Lambert',
          diffuseTexture: { uri: productModel.materialFile }, // Set the material file dynamically
        },
      });
      setIsTextureLoaded(true);
    }
  }, [productModel.materialFile]);

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
      {isTextureLoaded &&
        <Viro3DObject
          position={[0, 0, 0]}
          scale={scale}
          source={{uri: productModel.objFile}} // Use URI from the route data
          resources={[
            {uri: productModel.mtlFile},
            {uri: productModel.materialFile},
          ]} // Use URI for the MTL and texture files
          type="OBJ"
          materials={['grid']}
          onPinch={handlePinch}
        />}

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
 ;

  return (
    <ViroARSceneNavigator
      initialScene={{
        scene: () => <InitialScene productModel={model} />, // Pass model data as props to InitialScene
      }}
    />
  );
};

export default ARView;
