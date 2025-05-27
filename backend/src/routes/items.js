const express = require('express');
const router = express.Router();
const logger = require('../telemetry/logger');
const { trace } = require('@opentelemetry/api');

// Simulación de base de datos
let items = [
  { id: 1, name: 'Item 1', description: 'Descripción del item 1' },
  { id: 2, name: 'Item 2', description: 'Descripción del item 2' },
  { id: 3, name: 'Item 3', description: 'Descripción del item 3' }
];

// Obtener todos los items
router.get('/', (req, res) => {
  const tracer = trace.getTracer('items-service');
  
  // Crear un span personalizado para medir el tiempo de procesamiento
  const span = tracer.startSpan('get-all-items');
  
  try {
    // Simular latencia
    const delay = Math.floor(Math.random() * 100);
    setTimeout(() => {
      logger.info({
        msg: 'Items recuperados',
        count: items.length,
        latency: delay
      });
      
      // Añadir atributos al span
      span.setAttribute('items.count', items.length);
      span.setAttribute('processing.latency_ms', delay);
      
      res.json(items);
      span.end();
    }, delay);
  } catch (error) {
    logger.error({
      msg: 'Error al recuperar items',
      error: error.message
    });
    
    // Registrar el error en el span
    span.recordException(error);
    span.setStatus({ code: trace.SpanStatusCode.ERROR });
    span.end();
    
    res.status(500).json({ error: 'Error al recuperar items' });
  }
});

// Obtener un item por ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tracer = trace.getTracer('items-service');
  const span = tracer.startSpan('get-item-by-id');
  
  try {
    // Simular latencia
    const delay = Math.floor(Math.random() * 50);
    setTimeout(() => {
      const item = items.find(item => item.id === id);
      
      if (item) {
        logger.info({
          msg: 'Item recuperado',
          itemId: id,
          latency: delay
        });
        
        span.setAttribute('item.id', id);
        span.setAttribute('processing.latency_ms', delay);
        span.end();
        
        res.json(item);
      } else {
        logger.warn({
          msg: 'Item no encontrado',
          itemId: id
        });
        
        span.setAttribute('item.id', id);
        span.setAttribute('error', 'item_not_found');
        span.setStatus({ code: trace.SpanStatusCode.ERROR });
        span.end();
        
        res.status(404).json({ error: 'Item no encontrado' });
      }
    }, delay);
  } catch (error) {
    logger.error({
      msg: 'Error al recuperar item',
      itemId: id,
      error: error.message
    });
    
    span.recordException(error);
    span.setStatus({ code: trace.SpanStatusCode.ERROR });
    span.end();
    
    res.status(500).json({ error: 'Error al recuperar item' });
  }
});

// Crear un nuevo item
router.post('/', (req, res) => {
  const tracer = trace.getTracer('items-service');
  const span = tracer.startSpan('create-item');
  
  try {
    const { name, description } = req.body;
    
    // Validación básica
    if (!name || !description) {
      logger.warn({
        msg: 'Datos de item incompletos',
        body: req.body
      });
      
      span.setAttribute('error', 'invalid_input');
      span.setStatus({ code: trace.SpanStatusCode.ERROR });
      span.end();
      
      return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
    }
    
    // Simular latencia
    const delay = Math.floor(Math.random() * 150);
    setTimeout(() => {
      const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
      const newItem = { id: newId, name, description };
      
      items.push(newItem);
      
      logger.info({
        msg: 'Item creado',
        itemId: newId,
        latency: delay
      });
      
      span.setAttribute('item.id', newId);
      span.setAttribute('processing.latency_ms', delay);
      span.end();
      
      res.status(201).json(newItem);
    }, delay);
  } catch (error) {
    logger.error({
      msg: 'Error al crear item',
      error: error.message
    });
    
    span.recordException(error);
    span.setStatus({ code: trace.SpanStatusCode.ERROR });
    span.end();
    
    res.status(500).json({ error: 'Error al crear item' });
  }
});

// Actualizar un item
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tracer = trace.getTracer('items-service');
  const span = tracer.startSpan('update-item');
  
  try {
    const { name, description } = req.body;
    
    // Validación básica
    if (!name || !description) {
      logger.warn({
        msg: 'Datos de item incompletos',
        itemId: id,
        body: req.body
      });
      
      span.setAttribute('item.id', id);
      span.setAttribute('error', 'invalid_input');
      span.setStatus({ code: trace.SpanStatusCode.ERROR });
      span.end();
      
      return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
    }
    
    // Simular latencia
    const delay = Math.floor(Math.random() * 100);
    setTimeout(() => {
      const itemIndex = items.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        items[itemIndex] = { ...items[itemIndex], name, description };
        
        logger.info({
          msg: 'Item actualizado',
          itemId: id,
          latency: delay
        });
        
        span.setAttribute('item.id', id);
        span.setAttribute('processing.latency_ms', delay);
        span.end();
        
        res.json(items[itemIndex]);
      } else {
        logger.warn({
          msg: 'Item no encontrado para actualizar',
          itemId: id
        });
        
        span.setAttribute('item.id', id);
        span.setAttribute('error', 'item_not_found');
        span.setStatus({ code: trace.SpanStatusCode.ERROR });
        span.end();
        
        res.status(404).json({ error: 'Item no encontrado' });
      }
    }, delay);
  } catch (error) {
    logger.error({
      msg: 'Error al actualizar item',
      itemId: id,
      error: error.message
    });
    
    span.recordException(error);
    span.setStatus({ code: trace.SpanStatusCode.ERROR });
    span.end();
    
    res.status(500).json({ error: 'Error al actualizar item' });
  }
});

// Eliminar un item
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tracer = trace.getTracer('items-service');
  const span = tracer.startSpan('delete-item');
  
  try {
    // Simular latencia
    const delay = Math.floor(Math.random() * 75);
    setTimeout(() => {
      const itemIndex = items.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
        
        logger.info({
          msg: 'Item eliminado',
          itemId: id,
          latency: delay
        });
        
        span.setAttribute('item.id', id);
        span.setAttribute('processing.latency_ms', delay);
        span.end();
        
        res.status(204).end();
      } else {
        logger.warn({
          msg: 'Item no encontrado para eliminar',
          itemId: id
        });
        
        span.setAttribute('item.id', id);
        span.setAttribute('error', 'item_not_found');
        span.setStatus({ code: trace.SpanStatusCode.ERROR });
        span.end();
        
        res.status(404).json({ error: 'Item no encontrado' });
      }
    }, delay);
  } catch (error) {
    logger.error({
      msg: 'Error al eliminar item',
      itemId: id,
      error: error.message
    });
    
    span.recordException(error);
    span.setStatus({ code: trace.SpanStatusCode.ERROR });
    span.end();
    
    res.status(500).json({ error: 'Error al eliminar item' });
  }
});

module.exports = router;