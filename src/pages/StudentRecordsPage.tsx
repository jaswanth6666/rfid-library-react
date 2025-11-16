import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { db } from '../firebase';
import { ref, get, update } from 'firebase/database';

// --- TYPE DEFINITIONS ---
interface Student {
    name: string;
    roll: string;
    branch: string;
}

interface BookRecord {
    id: string;
    Book: string;
    "Issued DateTime": string;
    "Returned DateTime"?: string | null;
    finePaid?: number;
    dueDate: string;
    fine: number;
    isReturned: boolean;
}

const StudentRecordsPage = () => {
    const predefinedStudents: Student[] = [
        { name: "A. Sai Ganesh", roll: "24L31A0412", branch: "ECE" },
        { name: "B. Sandeep", roll: "24L31A0417", branch: "ECE" }
    ];

    const [searchInput, setSearchInput] = useState<string>('');
    const [studentInfo, setStudentInfo] = useState<Student | null>(null);
    const [issuedBooks, setIssuedBooks] = useState<BookRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async () => {
        const query = searchInput.trim().toLowerCase();
        const student = predefinedStudents.find(s => s.roll.toLowerCase() === query || s.name.toLowerCase().includes(query));

        if (!student) {
            alert("Student not found in the predefined list.");
            return;
        }

        setIsLoading(true);
        setStudentInfo(student);

        const booksRef = ref(db, `LibraryRecords/${student.roll}`);
        const snapshot = await get(booksRef);
        if (snapshot.exists()) {
            const booksData = snapshot.val();
            const booksArray: BookRecord[] = Object.entries(booksData).map(([id, book]: [string, any]) => {
                const issueDate = book["Issued DateTime"] || '-';
                const returnDate = book["Returned DateTime"] || null;
                const dueDate = calculateDueDate(issueDate);
                const fine = returnDate ? (book.finePaid || 0) : calculateFine(dueDate);
                
                return { id, ...book, dueDate, fine, isReturned: !!returnDate };
            });
            setIssuedBooks(booksArray);
        } else {
            setIssuedBooks([]);
        }
        setIsLoading(false);
    };

    const handleAcceptFine = async (bookId: string, fine: number) => {
        if (!studentInfo) return;
        const returnDate = new Date().toISOString().split('T')[0];
        const bookRef = ref(db, `LibraryRecords/${studentInfo.roll}/${bookId}`);
        await update(bookRef, { "Returned DateTime": returnDate, finePaid: fine, ReturnStatus: "Returned" });
        alert(`Fine of ₹${fine} accepted. Book marked as returned.`);
        await handleSearch();
    };
    
    const calculateDueDate = (issueDate: string): string => {
        if (issueDate === '-') return '-';
        const date = new Date(issueDate);
        date.setDate(date.getDate() + 14);
        return date.toISOString().split('T')[0];
    };

    const calculateFine = (dueDate: string): number => {
        if (dueDate === '-') return 0;
        const today = new Date();
        const due = new Date(dueDate);
        const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };
    
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 card-vignan flex flex-col gap-4">
                <h2 className="text-xl font-bold mb-2 text-vignan-maroon">Student Info</h2>
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter Roll Number or Name"
                    className="border p-2 rounded-md w-full"
                />
                <button onClick={handleSearch} className="btn-vignan mt-2">Search</button>
                {studentInfo && (
                    <div className="mt-4 space-y-2">
                        <p><strong>Name:</strong> {studentInfo.name}</p>
                        <p><strong>Roll Number:</strong> {studentInfo.roll}</p>
                        <p><strong>Branch:</strong> {studentInfo.branch}</p>
                    </div>
                )}
            </div>
            <div className="md:w-2/3 card-vignan overflow-x-auto">
                <h2 className="text-xl font-bold mb-2 text-vignan-maroon">Issued Books</h2>
                <table className="min-w-full">
                    <thead className="border-b">
                        <tr className="bg-gray-50">
                           {['S.No', 'Book Serial', 'Book Name', 'Issued', 'Due', 'Returned', 'Fine (₹)', 'Action'].map(header => 
                                <th key={header} className="p-2 text-left text-sm font-semibold">{header}</th>
                           )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={8} className="text-center p-4">Loading...</td></tr>
                        ) : issuedBooks.length > 0 ? (
                            issuedBooks.map((book, i) => (
                                <tr key={book.id} className={!book.isReturned ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                                    <td className="p-2 text-center">{i + 1}</td>
                                    <td className="p-2">{book.id}</td>
                                    <td className="p-2">{book.Book || '-'}</td>
                                    <td className="p-2">{book["Issued DateTime"]}</td>
                                    <td className="p-2">{book.dueDate}</td>
                                    <td className="p-2">{book["Returned DateTime"] || 'Pending'}</td>
                                    <td className="p-2">{book.fine}</td>
                                    <td className="p-2">
                                        {!book.isReturned ? (
                                            book.fine > 0 ? (
                                                <button onClick={() => handleAcceptFine(book.id, book.fine)} className="btn-vignan text-sm">Accept & Return</button>
                                            ) : <span className="text-gray-500">Pending</span>
                                        ) : <span className="text-green-600 font-semibold">Returned</span>}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={8} className="text-center p-4 text-muted-text">Search for a student to see their records.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentRecordsPage;