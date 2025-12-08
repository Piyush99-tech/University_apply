"use client";

import { useState, useEffect } from "react";
import {
    getAllUniversities,
    createUniversity,
    getAllPrograms,
    createProgram
} from "@/lib/api";

export default function AdminProgramsPage() {
    const [universities, setUniversities] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    // Forms
    const [uniForm, setUniForm] = useState({ name: "", short_name: "", location: "" });
    const [progForm, setProgForm] = useState({
        university_id: "",
        code: "",
        name: "",
        degree_level: "BACHELOR",
        eligibility_rules: {}
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [uRes, pRes] = await Promise.all([
                getAllUniversities(),
                getAllPrograms()
            ]);
            setUniversities(uRes?.universities || []);
            setPrograms(pRes?.programs || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateUniversity = async (e) => {
        e.preventDefault();
        try {
            await createUniversity(uniForm);
            setUniForm({ name: "", short_name: "", location: "" });
            fetchData(); // Refresh
            alert("University created!");
        } catch (err) {
            alert("Failed to create university");
        }
    };

    const handleCreateProgram = async (e) => {
        e.preventDefault();
        try {
            await createProgram(progForm);
            setProgForm({ ...progForm, code: "", name: "" }); // keep uni/degree
            fetchData(); // Refresh
            alert("Program created!");
        } catch (err) {
            alert("Failed to create program");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 space-y-12">
            <h1 className="text-3xl font-bold">Manage Programs & Universities</h1>

            {/* University Creation */}
            <section className="bg-white p-6 rounded-lg shadow border border-slate-200">
                <h2 className="text-xl font-semibold mb-4">Create New University</h2>
                <form onSubmit={handleCreateUniversity} className="flex gap-4 items-end flex-wrap">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            className="border p-2 rounded"
                            value={uniForm.name}
                            onChange={e => setUniForm({ ...uniForm, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Short Name</label>
                        <input
                            className="border p-2 rounded w-32"
                            value={uniForm.short_name}
                            onChange={e => setUniForm({ ...uniForm, short_name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                            className="border p-2 rounded"
                            value={uniForm.location}
                            onChange={e => setUniForm({ ...uniForm, location: e.target.value })}
                        />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Create University</button>
                </form>
            </section>

            {/* Program Creation */}
            <section className="bg-white p-6 rounded-lg shadow border border-slate-200">
                <h2 className="text-xl font-semibold mb-4">Create New Program</h2>
                <form onSubmit={handleCreateProgram} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">University</label>
                        <select
                            className="border p-2 rounded w-full"
                            value={progForm.university_id}
                            onChange={e => setProgForm({ ...progForm, university_id: e.target.value })}
                            required
                        >
                            <option value="">Select University...</option>
                            {universities.map(u => (
                                <option key={u.id} value={u.id}>{u.name} ({u.short_name})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Program Code</label>
                        <input
                            className="border p-2 rounded w-full"
                            value={progForm.code}
                            onChange={e => setProgForm({ ...progForm, code: e.target.value })}
                            placeholder="e.g. CS101"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Program Name</label>
                        <input
                            className="border p-2 rounded w-full"
                            value={progForm.name}
                            onChange={e => setProgForm({ ...progForm, name: e.target.value })}
                            placeholder="e.g. B.Tech Computer Science"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Degree Level</label>
                        <select
                            className="border p-2 rounded w-full"
                            value={progForm.degree_level}
                            onChange={e => setProgForm({ ...progForm, degree_level: e.target.value })}
                        >
                            <option value="BACHELOR">Bachelor</option>
                            <option value="MASTER">Master</option>
                            <option value="PHD">PhD</option>
                            <option value="DIPLOMA">Diploma</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                        <button className="bg-green-600 text-white px-6 py-2 rounded">Create Program</button>
                    </div>
                </form>
            </section>

            {/* List Existing */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Existing Programs</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Code</th>
                                <th className="py-2 px-4 border-b text-left">Program</th>
                                <th className="py-2 px-4 border-b text-left">University</th>
                                <th className="py-2 px-4 border-b text-left">Degree</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programs.map(p => (
                                <tr key={p.id}>
                                    <td className="py-2 px-4 border-b">{p.code}</td>
                                    <td className="py-2 px-4 border-b">{p.name}</td>
                                    <td className="py-2 px-4 border-b">{p.university_name}</td>
                                    <td className="py-2 px-4 border-b">{p.degree_level}</td>
                                </tr>
                            ))}
                            {programs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-gray-500">No programs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
