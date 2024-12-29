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
  ViroButton,
} from '@reactvision/react-viro';

// Define materials
ViroMaterials.createMaterials({
  grid: {
    lightingModel: 'Lambert',
    diffuseTexture: require('../assets/woodentable/wooden_table_color.png'),
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

const InitialScene = () => {
  const [scale, setScale] = useState([1, 1, 1]);

  const handlePinch = (pinchState: number, scaleFactor: number) => {
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
          source={require('../assets/woodentable/WoodenTable.obj')}
          resources={[require('../assets/woodentable/WoodenTable.mtl')]}
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

const ARView = () => {
  return <ViroARSceneNavigator initialScene={{scene: InitialScene}} />;
};

export default ARView;