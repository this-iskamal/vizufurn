import React, { useEffect, useState } from 'react';
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


const assetMap = {
  BedTable: {
    obj: require('../assets/BedTable/object.obj'),
    mtl: require('../assets/BedTable/object.mtl'),
    texture: require('../assets/BedTable/texture.png'),
  },
  WoodenStool: {
    obj: require('../assets/WoodenStool/object.obj'),
    mtl: require('../assets/WoodenStool/object.mtl'),
    texture: require('../assets/WoodenStool/texture.png'),
  }, 
};

ViroMaterials.createMaterials({
  grid: {
    lightingModel: 'Lambert',
  
  },
});


ViroARTrackingTargets.createTargets({
  markerTarget: {
    source: require('../assets/WoodenStool/marker.jpg'),
    orientation: 'Up',
    physicalWidth: 2,
  },
});

const InitialScene = ({ productModel }) => {
  const [scale, setScale] = useState([1, 1, 1]);
  const productName = productModel.product.name.replace(/\s+/g, '');
  
 
  const productAssets = assetMap[productName];

  useEffect(() => {
    
      ViroMaterials.createMaterials({
        grid: {
          lightingModel: 'Lambert',
          diffuseTexture: productAssets.texture,
        },
      });

   
    
  }, [productAssets]);

  const handlePinch = (pinchState, scaleFactor) => {
    if (pinchState === 3) {
      setScale((prevScale) => prevScale.map((value) => value * scaleFactor));
    }
  };

  if (!productAssets) {
    console.error(`Assets for product "${productName}" not found.`);
    return null;
  }

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />

      <ViroARImageMarker target="markerTarget">
        <Viro3DObject
          position={[0, 0, 0]}
          scale={scale}
          source={productAssets.obj} // Use preloaded OBJ file
          resources={[
            productAssets.mtl, // Use preloaded MTL file
            productAssets.texture, // Use preloaded texture file
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

const ARView = ({ route }) => {
  const { product } = route.params;
  const { model } = product;

  return (
    <ViroARSceneNavigator
      initialScene={{
        scene: () => <InitialScene productModel={model} />,
      }}
    />
  );
};

export default ARView;
