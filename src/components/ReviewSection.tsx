// ReviewSection.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BackendUrl } from '../utils/utils';

interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
  currentUserId?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, currentUserId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);


  const maskPhoneName = (name: string) => {
    // Check if name contains only numbers
    if (/^\d+$/.test(name)) {
      // Show first 5 digits and mask the rest
      return name.slice(0, 5) + 'x'.repeat(name.length - 5);
    }
    return name;
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BackendUrl}api/reviews/${productId}`);
      const data = await response.json();
   
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const submitReview = async () => {
    if (!currentUserId) {
      Alert.alert('Please login to submit a review');
      return;
    }

    try {
      const response = await fetch(`${BackendUrl}api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          userId: currentUserId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        setComment('');
        setRating(5);
        fetchReviews();
        Alert.alert('Success', 'Review submitted successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
    }
  };

  const updateReview = async () => {
    if (!editingReviewId) return;

    try {
      const response = await fetch(`${BackendUrl}api/reviews/${editingReviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (response.ok) {
        setEditingReviewId(null);
        setComment('');
        setRating(5);
        fetchReviews();
        Alert.alert('Success', 'Review updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update review');
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`${BackendUrl}api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchReviews();
        Alert.alert('Success', 'Review deleted successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete review');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReviewId(review._id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const renderStars = (rating: number) => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          size={16}
          color="gold"
        />
      ))}
    </View>
  );

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.userName}>{maskPhoneName(item.userId?.name)}</Text>
        {renderStars(item.rating)}
        <Text style={styles.reviewDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        {currentUserId === item.userId._id && (
          <View style={styles.actionButtonsTop}>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteReview(item._id)} style={styles.deleteButton}>
              <Ionicons name="trash-outline"  size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>

      <View style={styles.reviewForm}>
        <View style={styles.ratingInput}>
          <Text style={styles.ratingLabel}>Your Rating:</Text>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={24}
                  color="gold"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TextInput
          style={styles.commentInput}
          placeholder="Write your review here..."
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={editingReviewId ? updateReview : submitReview}
        >
          <Text style={styles.submitButtonText}>
            {editingReviewId ? 'Update Review' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.noReviews}>No reviews yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  reviewForm: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  ratingInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    marginRight: 8,
    fontSize: 16,
  },
  starContainer: {
    flexDirection: 'row',
  },
  commentInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: 'tomato',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reviewItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  reviewDate: {
    color: '#666',
    marginLeft: 'auto',
  },
  reviewComment: {
    color: '#333',
  },
  actionButtonsTop: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 8,
    
    padding: 8,
    borderRadius: 4,
  },
  editButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  deleteButton: {
    
    padding: 8,
    borderRadius: 4,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noReviews: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default ReviewSection;
