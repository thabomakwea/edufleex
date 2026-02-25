'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Video as VideoIcon } from 'lucide-react';

export default function AdminPage() {
    const [videos, setVideos] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoId: '',
        subject: '',
        grade: '',
        duration: '',
        categoryId: '',
        isFeatured: false,
    });

    useEffect(() => {
        // Fetch videos and categories via API
        const fetchData = async () => {
            const vRes = await fetch('/api/videos');
            const cRes = await fetch('/api/categories');
            if (vRes.ok) setVideos(await vRes.json());
            if (cRes.ok) setCategories(await cRes.json());
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        // Generate thumbnail from videoId
        const thumbnail = `https://img.youtube.com/vi/${formData.videoId}/0.jpg`;

        const url = editingVideoId ? `/api/videos/${editingVideoId}` : '/api/videos';
        const method = editingVideoId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                body: JSON.stringify({ ...formData, thumbnail }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                const updatedVideo = await res.json();
                if (editingVideoId) {
                    setVideos(videos.map(v => v.id === editingVideoId ? updatedVideo : v));
                    setSuccess('Video updated successfully!');
                } else {
                    setVideos([updatedVideo, ...videos]);
                    setSuccess('Video added successfully!');
                }
                resetForm();
            } else {
                const errorData = await res.json();
                setError(errorData.error || 'Failed to save video');
            }
        } catch (error) {
            setError('Network error occurred');
        }
        setIsSubmitting(false);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            videoId: '',
            subject: '',
            grade: '',
            duration: '',
            categoryId: '',
            isFeatured: false,
        });
        setEditingVideoId(null);
        setError(null);
        setSuccess(null);
    };

    const handleEdit = (video: any) => {
        setFormData({
            title: video.title,
            description: video.description,
            videoId: video.videoId,
            subject: video.subject,
            grade: video.grade,
            duration: video.duration,
            categoryId: video.categoryId,
            isFeatured: video.isFeatured,
        });
        setEditingVideoId(video.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            const res = await fetch(`/api/videos/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setVideos(videos.filter(v => v.id !== id));
                setSuccess('Video deleted successfully!');
            } else {
                const errorData = await res.json();
                setError(errorData.error || 'Failed to delete video');
            }
        } catch (error) {
            setError('Network error occurred while deleting');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-12">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-8 text-3xl font-bold text-gray-900">Admin Dashboard</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Form */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                            <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                                <Plus className="h-5 w-5" /> {editingVideoId ? 'Edit Video' : 'Add New Video'}
                            </h2>
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}
                            {success && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-sm text-green-600">{success}</p>
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">YouTube Video ID</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. fk0wyv1HpFg"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                        value={formData.videoId}
                                        onChange={e => setFormData({ ...formData, videoId: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                                        <input
                                            type="text"
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Grade</label>
                                        <input
                                            type="text"
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                            value={formData.grade}
                                            onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 10:30"
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                                            value={formData.categoryId}
                                            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    />
                                    <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Featured Content</label>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 rounded-md bg-black py-2.5 text-sm font-bold text-white transition hover:bg-black/80 disabled:bg-gray-400"
                                    >
                                        {isSubmitting ? 'Saving...' : editingVideoId ? 'Update Video' : 'Add Video'}
                                    </button>
                                    {editingVideoId && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Video</th>
                                        <th className="px-6 py-4">Subject/Grade</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {videos.map(v => (
                                        <tr key={v.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-16 overflow-hidden rounded bg-gray-200 relative">
                                                        <img src={v.thumbnail} className="object-cover h-full w-full" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 line-clamp-1">{v.title}</p>
                                                        <p className="text-xs text-gray-500">{v.duration}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">{v.subject}</span>
                                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">{v.grade}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 text-gray-400">
                                                    <button onClick={() => handleEdit(v)} className="hover:text-black"><Edit2 className="h-4 w-4" /></button>
                                                    <button onClick={() => handleDelete(v.id)} className="hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
