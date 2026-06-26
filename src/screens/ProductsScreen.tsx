<<<<<<< HEAD
// src/screens/ProductsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  Product,
} from '../services/productService';

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadProducts() {
    setLoading(true);
    try {
      console.log('Loading products...');
      const data = await getProducts();
      console.log('Products loaded: ', data.length, data);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setName('');
    setSku('');
    setPrice('');
    setStock('');
    setEditingId(null);
  }

  async function handleAdd() {
    if (editingId) {
      // if we are in edit mode, don't add
      return;
    }

    console.log('Add button pressed');
    if (!name.trim()) {
      console.log('Name is required');
      return;
    }

    try {
      console.log('Adding product...', { name, sku, price, stock });
      await addProduct({
        name: name.trim(),
        sku: sku.trim() || undefined,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
      });
      console.log('Product added, reloading list...');
      resetForm();
      await loadProducts();
    } catch (error) {
      console.error('Error adding product', error);
    }
  }

  async function handleUpdate() {
    if (!editingId) return;

    console.log('Update button pressed for', editingId);
    if (!name.trim()) {
      console.log('Name is required');
      return;
    }

    try {
      console.log('Updating product...', { editingId, name, sku, price, stock });
      await updateProduct(editingId, {
        name: name.trim(),
        sku: sku.trim() || undefined,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
      });
      console.log('Product updated, reloading list...');
      resetForm();
      await loadProducts();
    } catch (error) {
      console.error('Error updating product', error);
    }
  }

  function startEditing(product: Product) {
    if (!product.id) return;
    console.log('Start editing', product.id);
    setEditingId(product.id);
    setName(product.name);
    setSku(product.sku ?? '');
    setPrice(String(product.price ?? ''));
    setStock(String(product.stock ?? ''));
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    try {
      console.log('Deleting product', id);
      await deleteProduct(id);
      if (editingId === id) {
        resetForm();
      }
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>

      <View style={styles.form}>
        <Text style={styles.formTitle}>
          {editingId ? 'Edit Product' : 'Add Product'}
        </Text>

        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="SKU"
          style={styles.input}
          value={sku}
          onChangeText={setSku}
        />
        <TextInput
          placeholder="Price"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Stock"
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />

        {editingId ? (
          <View style={styles.buttonRow}>
            <Button title="Save Changes" onPress={handleUpdate} />
            <Button title="Cancel" onPress={resetForm} color="#888" />
          </View>
        ) : (
          <Button title="Add Product" onPress={handleAdd} />
        )}
      </View>

      <Text style={styles.subtitle}>
        {loading ? 'Loading products...' : 'Product List'}
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id || item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => startEditing(item)}
            style={styles.productRow}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>
              {!!item.sku && (
                <Text style={styles.productSku}>SKU: {item.sku}</Text>
              )}
              <Text>
                Price: {item.price} | Stock: {item.stock}
              </Text>
            </View>
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  form: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 8,
  },
  productName: {
    fontWeight: 'bold',
  },
  productSku: {
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-start',
  },
=======
// src/screens/ProductsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  Product,
} from '../services/productService';

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadProducts() {
    setLoading(true);
    try {
      console.log('Loading products...');
      const data = await getProducts();
      console.log('Products loaded: ', data.length, data);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setName('');
    setSku('');
    setPrice('');
    setStock('');
    setEditingId(null);
  }

  async function handleAdd() {
    if (editingId) {
      // if we are in edit mode, don't add
      return;
    }

    console.log('Add button pressed');
    if (!name.trim()) {
      console.log('Name is required');
      return;
    }

    try {
      console.log('Adding product...', { name, sku, price, stock });
      await addProduct({
        name: name.trim(),
        sku: sku.trim() || undefined,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
      });
      console.log('Product added, reloading list...');
      resetForm();
      await loadProducts();
    } catch (error) {
      console.error('Error adding product', error);
    }
  }

  async function handleUpdate() {
    if (!editingId) return;

    console.log('Update button pressed for', editingId);
    if (!name.trim()) {
      console.log('Name is required');
      return;
    }

    try {
      console.log('Updating product...', { editingId, name, sku, price, stock });
      await updateProduct(editingId, {
        name: name.trim(),
        sku: sku.trim() || undefined,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
      });
      console.log('Product updated, reloading list...');
      resetForm();
      await loadProducts();
    } catch (error) {
      console.error('Error updating product', error);
    }
  }

  function startEditing(product: Product) {
    if (!product.id) return;
    console.log('Start editing', product.id);
    setEditingId(product.id);
    setName(product.name);
    setSku(product.sku ?? '');
    setPrice(String(product.price ?? ''));
    setStock(String(product.stock ?? ''));
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    try {
      console.log('Deleting product', id);
      await deleteProduct(id);
      if (editingId === id) {
        resetForm();
      }
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>

      <View style={styles.form}>
        <Text style={styles.formTitle}>
          {editingId ? 'Edit Product' : 'Add Product'}
        </Text>

        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="SKU"
          style={styles.input}
          value={sku}
          onChangeText={setSku}
        />
        <TextInput
          placeholder="Price"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Stock"
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />

        {editingId ? (
          <View style={styles.buttonRow}>
            <Button title="Save Changes" onPress={handleUpdate} />
            <Button title="Cancel" onPress={resetForm} color="#888" />
          </View>
        ) : (
          <Button title="Add Product" onPress={handleAdd} />
        )}
      </View>

      <Text style={styles.subtitle}>
        {loading ? 'Loading products...' : 'Product List'}
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id || item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => startEditing(item)}
            style={styles.productRow}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>
              {!!item.sku && (
                <Text style={styles.productSku}>SKU: {item.sku}</Text>
              )}
              <Text>
                Price: {item.price} | Stock: {item.stock}
              </Text>
            </View>
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  form: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 8,
  },
  productName: {
    fontWeight: 'bold',
  },
  productSku: {
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-start',
  },
>>>>>>> 8f32440 (Initial app update)
});