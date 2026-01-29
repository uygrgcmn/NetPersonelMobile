import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Task } from '../../types';

interface TaskCardProps {
    task: Task;
    onPress: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return '#f44336';
            case 'medium': return '#ff9800';
            case 'low': return '#4caf50';
            default: return '#ccc';
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(task)} activeOpacity={0.8}>
            <View style={[styles.priorityLine, { backgroundColor: getPriorityColor(task.priority) }]} />
            <View style={styles.cardContent}>
                {/* Header: Tag */}
                <View style={styles.cardHeader}>
                    <View style={[styles.tagBadge, { backgroundColor: task.tagColor + '20' }]}>
                        <Text style={[styles.tagText, { color: task.tagColor }]}>{task.tag}</Text>
                    </View>
                    <MaterialCommunityIcons name="dots-horizontal" size={20} color="#999" />
                </View>

                {/* Title */}
                <Text style={styles.taskTitle}>{task.title}</Text>

                {/* Footer: Meta & Assignee */}
                <View style={styles.cardFooter}>
                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Feather name="clock" size={12} color="#999" />
                            <Text style={styles.metaText}>{task.date}</Text>
                        </View>
                        {task.comments > 0 && (
                            <View style={styles.metaItem}>
                                <MaterialCommunityIcons name="comment-outline" size={12} color="#999" />
                                <Text style={styles.metaText}>{task.comments}</Text>
                            </View>
                        )}
                        {task.attachments > 0 && (
                            <View style={styles.metaItem}>
                                <Feather name="paperclip" size={12} color="#999" />
                                <Text style={styles.metaText}>{task.attachments}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.assigneeAvatar}>
                        <Text style={styles.assigneeText}>{task.assignee}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
});
