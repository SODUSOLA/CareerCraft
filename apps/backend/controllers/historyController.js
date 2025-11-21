import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function ensureAuth(req, res) {
    if (!req.user?.id) {
        res.status(401).json({ message: 'Unauthorized' });
        return null;
    }
    return req.user.id;
}

/* ------------------ CAREER HISTORY ------------------ */
export const getCareerHistory = async (req, res) => {
    const userId = ensureAuth(req, res);
    if (!userId) return;

    try {
        const history = await prisma.careerLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ type: 'career', count: history.length, history });
    } catch (error) {
        console.error('Career history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteCareerHistory = async (req, res) => {
    const userId = ensureAuth(req, res);
    if (!userId) return;

    const { id } = req.params;

    try {
        const entry = await prisma.careerLog.findUnique({ where: { id } });

        if (!entry || entry.userId !== userId) {
            return res.status(404).json({ message: 'History not found' });
        }

        await prisma.careerLog.delete({ where: { id } });
        res.json({ message: 'Career history deleted' });
    } catch (error) {
        console.error('Delete career history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/* ------------------ CHAT HISTORY ------------------ */
export const getChatHistory = async (req, res) => {
    const userId = ensureAuth(req, res);
    if (!userId) return;

    try {
        const sessions = await prisma.chatSession.findMany({
            where: { userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 3, // only return a preview
                },
            },
            orderBy: { lastActivity: 'desc' },
        });

        res.json({ type: 'chat', count: sessions.length, sessions });
    } catch (error) {
        console.error('Chat history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteChatHistory = async (req, res) => {
    const userId = ensureAuth(req, res);
    if (!userId) return;

    const { id } = req.params;

    try {
        const session = await prisma.chatSession.findUnique({
            where: { id },
            include: { messages: true },
        });

        if (!session || session.userId !== userId) {
            return res.status(404).json({ message: 'Chat session not found' });
        }

        // Delete all messages first (to avoid FK constraint)
        await prisma.chatMessage.deleteMany({ where: { sessionId: id } });
        await prisma.chatSession.delete({ where: { id } });

        res.json({ message: 'Chat session deleted successfully' });
    } catch (error) {
        console.error('Delete chat history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/* ------------------ ALL HISTORY ------------------ */
export const getAllHistory = async (req, res) => {
    const userId = ensureAuth(req, res);
    if (!userId) return;

    try {
        const [careerLogs, chatSessions] = await Promise.all([
            prisma.careerLog.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.chatSession.findMany({
                where: { userId },
                orderBy: { lastActivity: 'desc' },
            }),
        ]);

        const unified = [
            ...careerLogs.map(log => ({
                id: log.id,
                type: 'career',
                content: log.response || log.summary,
                createdAt: log.createdAt,
            })),
            ...chatSessions.map(session => ({
                id: session.id,
                type: 'chat',
                content: `Chat session (${session.id.slice(0, 8)})`,
                createdAt: session.lastActivity,
            })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ type: 'all', total: unified.length, history: unified });
    } catch (error) {
        console.error('Unified history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};