import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Platform, TextInput, Dimensions, Modal, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Task } from '../../src/types';
import { TaskCard } from '../../src/components/cards/TaskCard';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width * 0.75;

// Mock Data
const COLUMNS = [
  { id: 'todo', title: 'Yapılacaklar', color: '#f44336' },
  { id: 'progress', title: 'Devam Edenler', color: '#ff9800' },
  { id: 'review', title: 'Onay Bekleyenler', color: '#2196f3' },
  { id: 'done', title: 'Tamamlananlar', color: '#4caf50' },
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', columnId: 'todo', title: 'Mobil arayüz tasarımı revizeleri', tag: 'Design', tagColor: '#e91e63', priority: 'high', comments: 3, attachments: 1, date: 'Bugün', assignee: 'U' },
  { id: 't2', columnId: 'todo', title: 'Backend API dokümantasyonu incelemesi', tag: 'Backend', tagColor: '#9c27b0', priority: 'medium', comments: 0, attachments: 2, date: 'Yarın', assignee: 'A' },
  { id: 't3', columnId: 'progress', title: 'Anket modülü entegrasyonu', tag: 'Dev', tagColor: '#2196f3', priority: 'high', comments: 5, attachments: 0, date: '10 Şub', assignee: 'U' },
  { id: 't4', columnId: 'review', title: 'Login ekranı testleri', tag: 'QA', tagColor: '#009688', priority: 'low', comments: 1, attachments: 4, date: 'Dün', assignee: 'M' },
  { id: 't5', columnId: 'done', title: 'Home ekranı dashboard yapısı', tag: 'Frontend', tagColor: '#3f51b5', priority: 'low', comments: 2, attachments: 0, date: '28 Oca', assignee: 'U' },
];

const TAG_OPTIONS = [
  { label: 'Design', color: '#e91e63' },
  { label: 'Backend', color: '#9c27b0' },
  { label: 'Frontend', color: '#3f51b5' },
  { label: 'QA', color: '#009688' },
  { label: 'Dev', color: '#2196f3' },
];

const PRIORITY_OPTIONS = [
  { label: 'High', value: 'high', color: '#f44336' },
  { label: 'Medium', value: 'medium', color: '#ff9800' },
  { label: 'Low', value: 'low', color: '#4caf50' },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [searchText, setSearchText] = useState('');

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState(TAG_OPTIONS[0]);
  const [selectedPriority, setSelectedPriority] = useState(PRIORITY_OPTIONS[1]); // Medium default
  const [selectedColumn, setSelectedColumn] = useState('todo');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#ccc';
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setTaskTitle('');
    setSelectedTag(TAG_OPTIONS[0]);
    setSelectedPriority(PRIORITY_OPTIONS[1]);
    setSelectedColumn('todo');
    setModalVisible(true);
  };

  const openEditModal = (task: any) => {
    setIsEditing(true);
    setSelectedTask(task);
    setTaskTitle(task.title);

    // Find matching tag option or default
    const tagOpt = TAG_OPTIONS.find(t => t.label === task.tag) || TAG_OPTIONS[0];
    setSelectedTag(tagOpt);

    // Find matching priority option
    const prioOpt = PRIORITY_OPTIONS.find(p => p.value === task.priority) || PRIORITY_OPTIONS[1];
    setSelectedPriority(prioOpt);

    setSelectedColumn(task.columnId);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!taskTitle.trim()) {
      Alert.alert('Uyarı', 'Lütfen görev başlığı giriniz.');
      return;
    }

    if (isEditing && selectedTask) {
      // Update existing
      const updatedTasks = tasks.map(t => {
        if (t.id === selectedTask.id) {
          return {
            ...t,
            title: taskTitle,
            tag: selectedTag.label,
            tagColor: selectedTag.color,
            priority: selectedPriority.value as 'high' | 'medium' | 'low',
            columnId: selectedColumn,
          };
        }
        return t;
      });
      setTasks(updatedTasks);
    } else {
      // Add new
      const newTask: Task = {
        id: Date.now().toString(),
        columnId: selectedColumn,
        title: taskTitle,
        tag: selectedTag.label,
        tagColor: selectedTag.color,
        priority: selectedPriority.value as 'high' | 'medium' | 'low',
        comments: 0,
        attachments: 0,
        date: 'Yeni',
        assignee: 'B', // Ben (User)
      };
      setTasks([...tasks, newTask]);
    }
    setModalVisible(false);
  };

  const handleDelete = () => {
    if (selectedTask) {
      Alert.alert('Sil', 'Bu görevi silmek istediğinize emin misiniz?', [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            const filtered = tasks.filter(t => t.id !== selectedTask.id);
            setTasks(filtered);
            setModalVisible(false);
          }
        }
      ]);
    }
  };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchText.toLowerCase()));



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#455a64" />

      {/* Top Bar */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#fff" />
          <TextInput
            placeholder="Görev ara..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Kanban Board */}
      <View style={styles.boardContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.boardScrollContent}
          decelerationRate="fast"
          snapToInterval={COLUMN_WIDTH + 20} // Width + Margin
        >
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter(t => t.columnId === col.id);
            return (
              <View key={col.id} style={styles.column}>
                {/* Column Header */}
                <View style={[styles.columnHeader, { borderTopColor: col.color }]}>
                  <Text style={styles.columnTitle}>{col.title}</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{colTasks.length}</Text>
                  </View>
                </View>

                {/* Tasks List */}
                <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
                  {colTasks.map((task, index) => (
                    <TaskCard
                      key={task.id || index}
                      task={task}
                      onPress={openEditModal}
                    />
                  ))}
                  <TouchableOpacity style={styles.addTaskCard} onPress={(() => {
                    setIsEditing(false);
                    setTaskTitle('');
                    setSelectedTag(TAG_OPTIONS[0]);
                    setSelectedPriority(PRIORITY_OPTIONS[1]);
                    setSelectedColumn(col.id); // Auto-select this column
                    setModalVisible(true);
                  })}>
                    <Ionicons name="add" size={20} color="#999" />
                    <Text style={styles.addTaskText}>Kart Ekle</Text>
                  </TouchableOpacity>
                  <View style={{ height: 20 }} />
                </ScrollView>
              </View>
            )
          })}
        </ScrollView>
      </View>

      {/* ADD/EDIT MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? 'Görevi Düzenle' : 'Yeni Görev'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            <ScrollView>
              <Text style={styles.label}>Başlık</Text>
              <TextInput
                style={styles.input}
                value={taskTitle}
                onChangeText={setTaskTitle}
                placeholder="Görev başlığı giriniz"
              />

              <Text style={styles.label}>Etiket</Text>
              <View style={styles.optionsRow}>
                {TAG_OPTIONS.map(tag => (
                  <TouchableOpacity
                    key={tag.label}
                    style={[styles.optionBadge, selectedTag.label === tag.label && styles.selectedOption]}
                    onPress={() => setSelectedTag(tag)}
                  >
                    <Text style={[styles.optionText, selectedTag.label === tag.label && { color: tag.color }]}>{tag.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Öncelik</Text>
              <View style={styles.optionsRow}>
                {PRIORITY_OPTIONS.map(prio => (
                  <TouchableOpacity
                    key={prio.value}
                    style={[styles.optionBadge, selectedPriority.value === prio.value && styles.selectedOption]}
                    onPress={() => setSelectedPriority(prio)}
                  >
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: prio.color, marginRight: 6 }} />
                    <Text style={styles.optionText}>{prio.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Durum (Sütun)</Text>
              <View style={styles.columnOptionsContainer}>
                {COLUMNS.map(col => (
                  <TouchableOpacity
                    key={col.id}
                    style={[styles.columnOption, selectedColumn === col.id && { borderColor: col.color, backgroundColor: col.color + '10' }]}
                    onPress={() => setSelectedColumn(col.id)}
                  >
                    <Text style={[styles.columnOptionText, selectedColumn === col.id && { color: col.color, fontWeight: 'bold' }]}>
                      {col.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

            </ScrollView>

            {/* Actions */}
            <View style={styles.modalActions}>
              {isEditing && (
                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                  <Feather name="trash-2" size={20} color="#f44336" />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A5D48', // User preferred color
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A5D48', // User preferred color
    zIndex: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
  },
  addBtn: {
    padding: 5,
  },
  boardContainer: {
    flex: 1,
    paddingTop: 10,
  },
  boardScrollContent: {
    paddingHorizontal: 10,
  },
  column: {
    width: COLUMN_WIDTH,
    backgroundColor: '#eceff1',
    marginHorizontal: 10,
    borderRadius: 12,
    height: '88%',
    paddingBottom: 10,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  countBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  tasksList: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  priorityLine: {
    width: 4,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  metaText: {
    fontSize: 11,
    color: '#999',
    marginLeft: 4,
  },
  assigneeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#37474f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assigneeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addTaskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    marginTop: 5,
  },
  addTaskText: {
    color: '#999',
    marginLeft: 5,
    fontWeight: '500',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  optionText: {
    fontSize: 13,
    color: '#555',
  },
  columnOptionsContainer: {
    marginTop: 5,
  },
  columnOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  columnOptionText: {
    color: '#555',
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 25,
    alignItems: 'center',
  },
  deleteBtn: {
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginRight: 10,
  },
  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#1A5D48',
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});