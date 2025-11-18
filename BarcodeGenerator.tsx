import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

// Try-catch import for QRCode
let QRCode: any;
try {
  QRCode = require('react-native-qrcode-svg').default;
} catch (e) {
  console.warn('react-native-qrcode-svg not available');
}

interface BarcodeGeneratorProps {
  onClose: () => void;
}

function BarcodeGenerator({ onClose }: BarcodeGeneratorProps) {
  const [inputData, setInputData] = useState('');
  const [generatedData, setGeneratedData] = useState('');
  const [codeType, setCodeType] = useState<'qr' | 'barcode'>('qr');

  const sampleData = [
    { label: 'Product Code', value: '1234567890123 07-20238', type: 'barcode' as const },
    { label: 'Website URL', value: 'https://www.example.com', type: 'qr' as const },
    { label: 'Contact Info', value: 'John Doe\n+1234567890\njohn@example.com', type: 'qr' as const },

  ];

  const handleGenerate = () => {
    if (inputData.trim()) {
      setGeneratedData(inputData.trim());
    } else {
      Alert.alert('Error', 'Please enter some data to generate a code');
    }
  };

  const handleSampleData = (value: string, type: 'qr' | 'barcode') => {
    setInputData(value);
    setCodeType(type);
    setGeneratedData(value);
  };

  const renderQRCode = () => {
    if (!QRCode) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌</Text>
          <Text style={styles.errorNote}>
            QR Code library not installed.{'\n'}
            Run: npm install react-native-svg react-native-qrcode-svg
          </Text>
        </View>
      );
    }

    try {
      return (
        <QRCode
          value={generatedData}
          size={200}
          backgroundColor="white"
          color="black"
        />
      );
    } catch (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌</Text>
          <Text style={styles.errorNote}>
            Error rendering QR Code: {error instanceof Error ? error.message : 'Unknown error'}
          </Text>
        </View>
      );
    }
  };

  console.log(generatedData);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Code Generator</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Code Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, codeType === 'qr' && styles.typeButtonActive]}
            onPress={() => setCodeType('qr')}
          >
            <Text style={[styles.typeButtonText, codeType === 'qr' && styles.typeButtonTextActive]}>
              QR Code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, codeType === 'barcode' && styles.typeButtonActive]}
            onPress={() => setCodeType('barcode')}
          >
            <Text style={[styles.typeButtonText, codeType === 'barcode' && styles.typeButtonTextActive]}>
              Barcode
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Enter Data:</Text>
          <TextInput
            style={styles.input}
            value={inputData}
            onChangeText={setInputData}
            placeholder="Enter text, URL, or data..."
            placeholderTextColor="#94a3b8"
            multiline
          />
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
            <Text style={styles.generateButtonText}>Generate Code</Text>
          </TouchableOpacity>
        </View>

        {/* Generated Code Display */}
        {generatedData && (
          <View style={styles.codeDisplay}>
            <Text style={styles.codeLabel}>Generated {codeType === 'qr' ? 'QR Code' : 'Barcode'}:</Text>
            <View style={styles.codeContainer}>
              {codeType === 'qr' ? (
                renderQRCode()
              ) : (
                <View style={styles.barcodeSimulation}>
                  <Text style={styles.barcodeText}>📊</Text>
                  <Text style={styles.barcodeNote}>
                    Note: For actual barcode rendering, use a library like react-native-barcode-builder
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.dataText}>{generatedData}</Text>
          </View>
        )}

        {/* Sample Data Section */}
        <View style={styles.samplesSection}>
          <Text style={styles.samplesTitle}>Quick Samples:</Text>
          {sampleData.map((sample, index) => (
            <TouchableOpacity
              key={index}
              style={styles.sampleButton}
              onPress={() => handleSampleData(sample.value, sample.type)}
            >
              <View style={styles.sampleContent}>
                <Text style={styles.sampleLabel}>{sample.label}</Text>
                <Text style={styles.sampleType}>{sample.type.toUpperCase()}</Text>
              </View>
              <Text style={styles.sampleValue} numberOfLines={1}>
                {sample.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>💡 How to use:</Text>
          <Text style={styles.instructionsText}>
            1. Select code type (QR or Barcode){'\n'}
            2. Enter your custom data or use a sample{'\n'}
            3. Generate the code{'\n'}
            4. Close this screen and scan the generated code{'\n'}
            5. Take a screenshot to test scanning
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#f1f5f9',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: '#6366f1',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    color: '#f1f5f9',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#334155',
  },
  generateButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  codeDisplay: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  codeContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  barcodeSimulation: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  barcodeText: {
    fontSize: 64,
    marginBottom: 12,
  },
  barcodeNote: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  errorContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 64,
    marginBottom: 12,
  },
  errorNote: {
    fontSize: 12,
    color: '#ef4444',
    textAlign: 'center',
  },
  dataText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  samplesSection: {
    marginBottom: 24,
  },
  samplesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  sampleButton: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sampleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sampleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  sampleType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    backgroundColor: '#312e81',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sampleValue: {
    fontSize: 14,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  instructions: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
});

export default BarcodeGenerator;
