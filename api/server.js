const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Статические файлы
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/locales', express.static(path.join(__dirname, '../locales')));

// API endpoints
app.get('/api/channels', (req, res) => {
  const { user_id, limit = 100, offset = 0 } = req.query;
  
  // Тестовые данные
  const channels = [];
  const total = 100;
  
  for (let i = offset; i < Math.min(offset + limit, total); i++) {
    channels.push({
      id: `channel_${i}`,
      name: `Канал ${i}`,
      members_count: 1000 + i * 100,
      is_member: true
    });
  }
  
  res.json({
    channels,
    total,
    has_more: offset + channels.length < total
  });
});

app.post('/api/analyze', (req, res) => {
  const { channel_ids } = req.body;
  
  res.json({
    task_id: `task_${channel_ids.length}_${Date.now()}`,
    status: 'queued',
    progress: { current: 0, total: channel_ids.length }
  });
});

app.get('/api/analyze/:taskId', (req, res) => {
  const { taskId } = req.params;
  
  // Заглушка прогресса
  res.json({
    task_id: taskId,
    status: 'processing',
    progress: { current: 3, total: 10 }
  });
});

app.post('/api/channels/:channelId/leave', (req, res) => {
  const { channelId } = req.params;
  const { user_id } = req.body;
  
  res.json({ 
    success: true, 
    message: `Left channel ${channelId}` 
  });
});

app.post('/api/channels/:channelId/block', (req, res) => {
  const { channelId } = req.params;
  const { user_id } = req.body;
  
  res.json({ 
    success: true, 
    message: `Blocked channel ${channelId}` 
  });
});

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
