import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- TYPE DEFINITIONS for our data ---
interface LibraryItem {
    name: string;
    serial: string;
}

interface BookRecord {
    Book: string;
    "Issued DateTime": string;
    "Returned DateTime"?: string | null;
    Name: string;
}

interface FormattedRecord {
    serial: string;
    student: string;
    issued: string;
    returned: string;
}

const AnalyticsPage = () => {
    // State for the entire page
    const [allLibraryItems, setAllLibraryItems] = useState<LibraryItem[]>([]);
    const [allRecords, setAllRecords] = useState<Record<string, Record<string, BookRecord>>>({});
    
    // Search state
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState<LibraryItem[]>([]);
    const [selectedBook, setSelectedBook] = useState<LibraryItem | null>(null);

    // Table state
    const [filteredRecords, setFilteredRecords] = useState<FormattedRecord[]>([]);

    // Chart state
    const [issuesChartData, setIssuesChartData] = useState<any>({ labels: [], datasets: [] });
    const [returnsChartData, setReturnsChartData] = useState<any>({ labels: [], datasets: [] });

    // "Add Book" form state
    const [newBookName, setNewBookName] = useState('');
    const [newBookSerial, setNewBookSerial] = useState('');
    const [newBookCategory, setNewBookCategory] = useState('Book');

    // --- DATA FETCHING & PROCESSING ---

    // Effect to fetch all library items and records on initial load
    useEffect(() => {
        const itemsRef = ref(db, 'LibraryItems');
        const recordsRef = ref(db, 'LibraryRecords');

        const seededBooks: LibraryItem[] = [
            { name: "Embedded Systems", serial: "001" },
            { name: "C Programming", serial: "002" }
        ];

        const unsubItems = onValue(itemsRef, (snapshot) => {
            const remoteItems: LibraryItem[] = [];
            const itemsData = snapshot.val();
            if (itemsData) {
                ['Books', 'Journals', 'Articles'].forEach(cat => {
                    if (itemsData[cat]) {
                        Object.entries(itemsData[cat]).forEach(([id, item]: [string, any]) => {
                            remoteItems.push({ name: item.name || 'Unknown', serial: id });
                        });
                    }
                });
            }
            // Combine and remove duplicates, giving preference to remote data
            const combinedMap = new Map<string, LibraryItem>();
            [...seededBooks, ...remoteItems].forEach(item => combinedMap.set(item.serial, item));
            setAllLibraryItems(Array.from(combinedMap.values()));
        });

        const unsubRecords = onValue(recordsRef, (snapshot) => {
            setAllRecords(snapshot.exists() ? snapshot.val() : {});
        });

        return () => {
            unsubItems();
            unsubRecords();
        };
    }, []);

    // Effect to recalculate chart data whenever records change
    useEffect(() => {
        const issuesMap = new Map<string, number>();
        const returnsMap = new Map<string, number>();

        Object.values(allRecords).forEach(studentBooks => {
            Object.values(studentBooks).forEach(record => {
                const bookName = record.Book || 'Unknown';
                issuesMap.set(bookName, (issuesMap.get(bookName) || 0) + 1);

                const isReturned = record["Returned DateTime"] && record["Returned DateTime"] !== 'Pending';
                if (isReturned) {
                    returnsMap.set(bookName, (returnsMap.get(bookName) || 0) + 1);
                }
            });
        });

        const topIssues = Array.from(issuesMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topReturns = Array.from(returnsMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

        setIssuesChartData({
            labels: topIssues.map(item => item[0]),
            datasets: [{ data: topIssues.map(item => item[1]), backgroundColor: 'var(--vignan-maroon)' }]
        });
        setReturnsChartData({
            labels: topReturns.map(item => item[0]),
            datasets: [{ data: topReturns.map(item => item[1]), backgroundColor: 'rgba(161, 26, 31, 0.7)' }]
        });

    }, [allRecords]);

    // Effect to filter the table when a book is selected
    useEffect(() => {
        if (!selectedBook) {
            setFilteredRecords([]);
            return;
        }
        const records: FormattedRecord[] = [];
        Object.values(allRecords).forEach(studentBooks => {
            Object.entries(studentBooks).forEach(([serial, record]) => {
                if (serial === selectedBook.serial) {
                    records.push({
                        serial: serial,
                        student: record.Name || 'Unknown',
                        issued: record["Issued DateTime"],
                        returned: record["Returned DateTime"] || 'Pending'
                    });
                }
            });
        });
        records.sort((a, b) => new Date(b.issued).getTime() - new Date(a.issued).getTime());
        setFilteredRecords(records);
    }, [selectedBook, allRecords]);


    // --- EVENT HANDLERS ---

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchInput(query);
        if (query.length > 0) {
            const filtered = allLibraryItems.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.serial.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (book: LibraryItem) => {
        setSelectedBook(book);
        setSearchInput(book.name);
        setSuggestions([]);
    };

    const handleAddBook = async (e: FormEvent) => {
        e.preventDefault();
        if (!newBookName || !newBookSerial) {
            alert('Please fill out all fields.');
            return;
        }

        const categoryPlural = newBookCategory === 'Book' ? 'Books' : (newBookCategory === 'Journal' ? 'Journals' : 'Articles');
        const newItemRef = ref(db, `LibraryItems/${categoryPlural}/${newBookSerial}`);
        
        try {
            await set(newItemRef, { name: newBookName, addedDate: new Date().toISOString() });
            alert('Item added successfully!');
            setNewBookName('');
            setNewBookSerial('');
        } catch (error) {
            console.error("Error adding item:", error);
            alert('Failed to add item. Check console for details.');
        }
    };

    const chartOptions = { responsive: true, plugins: { legend: { display: false } } };

    return (
        <>
            <h1 className="text-3xl font-bold text-vignan-maroon mb-8">Analytics & Records</h1>
            
            {/* Search Section */}
            <div className="max-w-3xl mx-auto mb-12 relative">
                <div className="card-vignan p-4">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchChange}
                        placeholder="Search by Book Name or Serial (e.g., Embedded Systems or 001)"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-vignan-maroon"
                    />
                </div>
                {suggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-20">
                        {suggestions.map(book => (
                            <li
                                key={book.serial}
                                onClick={() => handleSuggestionClick(book)}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                            >
                                {book.name} ({book.serial})
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Results Table */}
            <div className="card-vignan mb-12 overflow-x-auto">
                <h2 className="text-xl font-bold mb-4 text-vignan-maroon">Book Issue Records</h2>
                <table className="min-w-full">
                    <thead className="border-b">
                        <tr className="bg-gray-50">
                            {['Serial', 'Student Name', 'Issued Date', 'Returned Date'].map(h => 
                                <th key={h} className="p-3 text-left text-sm font-semibold">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredRecords.length > 0 ? filteredRecords.map((record, i) => (
                            <tr key={i} className={record.returned === 'Pending' ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                                <td className="p-3">{record.serial}</td>
                                <td className="p-3">{record.student}</td>
                                <td className="p-3">{record.issued}</td>
                                <td className="p-3">{record.returned}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} className="text-center p-4 text-muted-text">
                                {selectedBook ? 'No issue records found for this book.' : 'Search for a book to view its records.'}
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="card-vignan">
                    <h3 className="text-lg font-semibold mb-4 text-center">Top 5 Most Issued Books</h3>
                    <Bar data={issuesChartData} options={chartOptions} />
                </div>
                <div className="card-vignan">
                    <h3 className="text-lg font-semibold mb-4 text-center">Top 5 Most Returned Books</h3>
                    <Bar data={returnsChartData} options={chartOptions} />
                </div>
            </div>

            {/* Add New Book Form */}
            <div className="card-vignan max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-6 text-vignan-maroon">Add New Book/Journal</h2>
                <form onSubmit={handleAddBook} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Book/Journal Name</label>
                        <input
                            type="text"
                            value={newBookName}
                            onChange={(e) => setNewBookName(e.target.value)}
                            required
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vignan-maroon"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Serial Number</label>
                        <input
                            type="text"
                            value={newBookSerial}
                            onChange={(e) => setNewBookSerial(e.target.value)}
                            required
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vignan-maroon"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            value={newBookCategory}
                            onChange={(e) => setNewBookCategory(e.target.value)}
                            required
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vignan-maroon"
                        >
                            <option value="Book">Book</option>
                            <option value="Journal">Journal</option>
                            <option value="Article">Article</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-vignan w-full">Add to Library</button>
                </form>
            </div>
        </>
    );
};

export default AnalyticsPage;