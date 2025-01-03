import React, {FC, useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/Navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimilarProducts from '../components/SimilarProducts';
import {useCartStore} from '../state/cartStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackendUrl } from '../utils/utils';

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetail'
>;

interface ProductDetailProps {
  route: ProductDetailScreenRouteProp;
}

const {width, height} = Dimensions.get('window');

const ProductDetail: FC<ProductDetailProps> = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const {product: initialProduct} = route.params;
  const [product, setProduct] = useState(initialProduct);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showGallery, setShowGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [quantity, setQuantity] = useState(1);
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    if (route.params?.product) {
      setProduct(route.params.product);
    }
  }, [route.params?.product]);
  const {items, addToCart} = useCartStore();

  const handleAddToCart = () => {
    const existingItem = items.find(item => item._id === product._id);

    if (existingItem) {
      Alert.alert(`${product.name} is already in the cart.`);
    } else {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
      });
    }
  };




  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const renderGalleryImage = ({item}: {item: string}) => (
    <View style={styles.galleryImageContainer}>
      <Image source={{uri: item}} style={styles.fullscreenImage} />
    </View>
  );

  const getModelFromBackend = async () => {
    try {
      const response = await fetch(
        `${BackendUrl}api/getmodels?productId=${product._id}`,
      );
      if (!response.ok) throw new Error('Failed to fetch model');

      const models = await response.json();
      if (models && models.length > 0) {
        const model = models[0];
        setProduct(prevProduct => ({...prevProduct, model}));
      }
    } catch (error) {
      console.error('Error fetching model:', error);
    }
  };

  useEffect(() => {
    getModelFromBackend();
  }, [product._id]);

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            <View style={styles.imageContainer}>
              <Image source={{uri: product.images[0]}} style={styles.image} />
              <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                  navigation.reset({routes: [{name: 'MainApp' as never}]})
                }>
                <Ionicons name="home" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={[styles.detailContainer, styles.roundedTop]}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.price}>Rs {product.price}</Text>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="gold" />
                <Text style={styles.rating}>4.6</Text>
                <Text style={styles.reviewCount}>98 Reviews</Text>
              </View>
              <Text style={styles.description}>{product.description}</Text>

              <Text style={styles.sectionTitle}>Product Images</Text>
              <View style={styles.imageRow}>
                {product.images
                  .slice(0, 3)
                  .map((image: string, index: number) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => openGallery(index)}>
                      <Image source={{uri: image}} style={styles.thumbnail} />
                    </TouchableOpacity>
                  ))}
                {product.images.length > 3 && (
                  <TouchableOpacity onPress={() => openGallery(3)}>
                    <View style={styles.seeMoreButton}>
                      <Text style={styles.seeMoreText}>See More</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.buttonRowContainer}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={decreaseQuantity}>
                    <Ionicons name="remove" size={20} color="tomato" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={increaseQuantity}>
                    <Ionicons name="add" size={20} color="tomato" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.addToCartButtonContainer}
                  onPress={handleAddToCart}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraIconButton}
                  onPress={() => navigation.navigate('ARView', {product})}>
                  <Ionicons name="camera" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={{flex: 1}}>
            <SimilarProducts
              category={product.category}
              currentitem={product._id}
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={showGallery} transparent={true} animationType="fade">
        <View style={styles.galleryModal}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={closeGallery}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <FlatList
            ref={flatListRef}
            data={product.images}
            renderItem={renderGalleryImage}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            initialScrollIndex={currentIndex}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onScrollToIndexFailed={info => {
              console.warn('Scroll to index failed:', info);
              setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              }, 100);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  imageContainer: {width: '100%', height: 300, position: 'relative'},
  image: {width: '100%', height: '100%', resizeMode: 'cover'},
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: 'white',
    padding: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'tomato',
    borderWidth: 1,
  },
  quantityText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },

  detailContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: -40,
    elevation: 5,
  },
  roundedTop: {borderTopLeftRadius: 24, borderTopRightRadius: 24},
  name: {fontSize: 24, fontWeight: 'bold', marginBottom: 8},
  price: {fontSize: 20, fontWeight: 'bold', color: 'tomato', marginBottom: 16},
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {fontSize: 16, fontWeight: 'bold', marginRight: 8},
  reviewCount: {fontSize: 14, color: '#888'},
  description: {fontSize: 16, color: '#666', marginBottom: 20},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 8},
  imageRow: {flexDirection: 'row', alignItems: 'center'},
  thumbnail: {width: 70, height: 70, marginRight: 10, borderRadius: 8},
  seeMoreButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  seeMoreText: {fontSize: 14, color: 'blue', fontWeight: 'bold'},
  buttonRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  addToCartButtonContainer: {
    backgroundColor: 'tomato',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    flex: 0.9,
  },
  cameraIconButton: {
    backgroundColor: 'tomato',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  galleryModal: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  galleryImageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default ProductDetail;
