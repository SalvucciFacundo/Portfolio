import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Cargar variables de entorno
dotenv.config();

let serviceAccount: any = null;

const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
if (serviceAccountEnv) {
  if (serviceAccountEnv.trim().startsWith('{')) {
    try {
      serviceAccount = JSON.parse(serviceAccountEnv);
      console.error('Credenciales de Firebase cargadas desde JSON raw en variable de entorno.');
    } catch (e) {
      console.error('Error al parsear el JSON de la variable de entorno FIREBASE_SERVICE_ACCOUNT:', e);
    }
  } else {
    // Tratar como ruta de archivo
    const resolvedPath = path.resolve(serviceAccountEnv);
    if (fs.existsSync(resolvedPath)) {
      try {
        serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
        console.error(`Credenciales de Firebase cargadas desde la ruta: ${resolvedPath}`);
      } catch (e) {
        console.error(`Error al leer el archivo de la cuenta de servicio en ${resolvedPath}:`, e);
      }
    } else {
      console.error(`No se encontró el archivo de cuenta de servicio en la ruta indicada: ${resolvedPath}`);
    }
  }
}

// Fallback: buscar archivo local en la raíz del servidor mcp
if (!serviceAccount) {
  const localPath = path.resolve(process.cwd(), 'service-account.json');
  if (fs.existsSync(localPath)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      console.error('Usando archivo local service-account.json.');
    } catch (e) {
      console.error('Error al leer el archivo local service-account.json:', e);
    }
  }
}

if (!serviceAccount) {
  console.error('ERROR CRÍTICO: No se encontraron credenciales de cuenta de servicio de Firebase.');
  console.error('Por favor, define la variable de entorno FIREBASE_SERVICE_ACCOUNT (con la ruta o el JSON crudo) o coloca un archivo service-account.json en la raíz de mcp-server.');
  process.exit(1);
}

// Inicializar Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.error('Firebase Admin SDK inicializado exitosamente.');
} catch (error) {
  console.error('Error al inicializar Firebase Admin SDK:', error);
  process.exit(1);
}

const db = admin.firestore();

// Instanciar el servidor MCP
const server = new Server(
  {
    name: 'portfolio-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Definir las herramientas disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_profile',
        description: 'Obtiene la información de perfil actual del portafolio (about/profile).',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'update_profile',
        description: 'Actualiza campos específicos en el perfil del portafolio (about/profile).',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            role: { type: 'string' },
            status: { type: 'string' },
            location: { type: 'string' },
            timezone: { type: 'string' },
            availability: { type: 'string' },
            bio: { type: 'string' },
            education: {
              type: 'object',
              properties: {
                degree: { type: 'string' },
                university: { type: 'string' },
              },
            },
            languages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  level: { type: 'string' },
                },
                required: ['name', 'level'],
              },
            },
            softSkills: { type: 'array', items: { type: 'string' } },
            avatarUrl: { type: 'string' },
            certifications: { type: 'array', items: { type: 'string' } },
            socials: {
              type: 'object',
              properties: {
                github: { type: 'string' },
                linkedin: { type: 'string' },
                twitter: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        },
      },
      {
        name: 'get_contact_info',
        description: 'Obtiene el título y mensaje de la sección de contacto (about/contact).',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'update_contact_info',
        description: 'Actualiza el título y mensaje de la sección de contacto (about/contact).',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
      {
        name: 'list_skills',
        description: 'Lista todos los grupos de habilidades y tecnologías.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'save_skill_group',
        description: 'Crea o actualiza un grupo de habilidades (SkillGroup).',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID del documento en Firestore. Si se omite, se generará uno nuevo.' },
            category: { type: 'string', description: 'Categoría (ej: Frontend, Backend, etc.)' },
            items: { type: 'array', items: { type: 'string' }, description: 'Lista de tecnologías' },
          },
          required: ['category', 'items'],
        },
      },
      {
        name: 'delete_skill_group',
        description: 'Elimina un grupo de habilidades por su ID de documento.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID del documento a eliminar' },
          },
          required: ['id'],
        },
      },
      {
        name: 'list_projects',
        description: 'Lista todos los proyectos del portafolio ordenados.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'save_project',
        description: 'Crea o actualiza un proyecto del portafolio (Project).',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID del documento en Firestore. Si se omite, se generará uno nuevo.' },
            title: { type: 'string' },
            description: { type: 'string' },
            imageUrl: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            links: {
              type: 'object',
              properties: {
                github: { type: 'string' },
                live: { type: 'string' },
              },
            },
            featured: { type: 'boolean' },
            order: { type: 'number' },
            role: { type: 'string' },
            host: { type: 'string' },
            exeName: { type: 'string' },
          },
          required: ['title', 'description', 'tags', 'featured', 'order'],
        },
      },
      {
        name: 'delete_project',
        description: 'Elimina un proyecto por su ID de documento.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID del proyecto a eliminar' },
          },
          required: ['id'],
        },
      },
    ],
  };
});

// Manejar llamadas a herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_profile': {
        const docRef = db.collection('about').doc('profile');
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
          return { content: [{ type: 'text', text: JSON.stringify({ message: 'Profile document not found' }) }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify({ id: docSnap.id, ...docSnap.data() }) }] };
      }

      case 'update_profile': {
        const docRef = db.collection('about').doc('profile');
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.update(args as any);
        } else {
          await docRef.set(args as any);
        }
        return { content: [{ type: 'text', text: 'Profile updated successfully' }] };
      }

      case 'get_contact_info': {
        const docRef = db.collection('about').doc('contact');
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
          return { content: [{ type: 'text', text: JSON.stringify({ message: 'Contact document not found' }) }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify({ id: docSnap.id, ...docSnap.data() }) }] };
      }

      case 'update_contact_info': {
        const docRef = db.collection('about').doc('contact');
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.update(args as any);
        } else {
          await docRef.set(args as any);
        }
        return { content: [{ type: 'text', text: 'Contact info updated successfully' }] };
      }

      case 'list_skills': {
        const snapshot = await db.collection('skills').get();
        const skillsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return { content: [{ type: 'text', text: JSON.stringify(skillsList) }] };
      }

      case 'save_skill_group': {
        const data = { ...args } as any;
        const id = data.id;
        delete data.id;

        if (id) {
          await db.collection('skills').doc(id).set(data, { merge: true });
          return { content: [{ type: 'text', text: `Skill group '${id}' saved successfully` }] };
        } else {
          const docRef = await db.collection('skills').add(data);
          return { content: [{ type: 'text', text: `Skill group created with ID: ${docRef.id}` }] };
        }
      }

      case 'delete_skill_group': {
        const { id } = args as { id: string };
        await db.collection('skills').doc(id).delete();
        return { content: [{ type: 'text', text: `Skill group '${id}' deleted successfully` }] };
      }

      case 'list_projects': {
        const snapshot = await db.collection('projects').orderBy('order', 'asc').get();
        const projectsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return { content: [{ type: 'text', text: JSON.stringify(projectsList) }] };
      }

      case 'save_project': {
        const data = { ...args } as any;
        const id = data.id;
        delete data.id;

        if (id) {
          await db.collection('projects').doc(id).set(data, { merge: true });
          return { content: [{ type: 'text', text: `Project '${id}' saved successfully` }] };
        } else {
          const docRef = await db.collection('projects').add(data);
          return { content: [{ type: 'text', text: `Project created with ID: ${docRef.id}` }] };
        }
      }

      case 'delete_project': {
        const { id } = args as { id: string };
        await db.collection('projects').doc(id).delete();
        return { content: [{ type: 'text', text: `Project '${id}' deleted successfully` }] };
      }

      default:
        throw new Error(`Tool not found: ${name}`);
    }
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Error: ${error?.message || error}` }],
    };
  }
});

// Arrancar el servidor MCP usando transporte STDIO
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Portfolio MCP Server running on stdio');
}

run().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
