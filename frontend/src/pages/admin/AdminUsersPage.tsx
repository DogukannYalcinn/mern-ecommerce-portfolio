import {useState, useEffect, useRef} from "react";
import adminApi from "@api/adminApi.ts";
import AdminTable from "@pages/admin/AdminTable.tsx";
import Spinner from "@components/ui/Spinner.tsx";
import {UserType} from "@types";
import NoResults from "@components/ui/NoResults.tsx";

const AdminUsersPage = () => {
    const [state, setState] = useState({
        searchTerm: "",
        users: [],
        page: 1,
        totalCount: 0,
        limit: 10,
        isLoading: false,
    });

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleDebounceSearchTerm = (term: string) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            handleSearchTermChange(term);
        }, 800);
    };

    const handleSearchTermChange = (term: string) =>
        setState((prevState) => ({
            ...prevState,
            searchTerm: term,
            page: 1,
            filter: "",
        }));

    const handlePageChange = (pageNumber: number) => {
        setState((prevState) => ({
            ...prevState,
            page: prevState.page + pageNumber,
        }));
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setState((prevState) => ({...prevState, isLoading: true}));
            try {
                const response = await adminApi.fetchAllUsers({
                    page: state.page,
                    limit: state.limit,
                    searchTerm: state.searchTerm,
                });
                setState((prevState) => ({
                    ...prevState,
                    users: response.users,
                    totalCount: response.totalCount,
                }));
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setState((prevState) => ({...prevState, isLoading: false}));
            }
        };
        fetchUsers();
    }, [state.page, state.searchTerm, state.limit]);

    return (
        <>
            {state.isLoading && <Spinner/>}
            <main className="min-h-screen bg-gray-100  px-4 py-8">
                <section className="w-full max-w-7xl mx-auto">
                    <AdminTable
                        title="User Management"
                        headers={[
                            "First Name",
                            "Last Name",
                            "Email",
                            "Phone",
                            "Delivery Address",
                            "Home Address",
                        ]}
                        pagination={{
                            page: state.page,
                            limit: state.limit,
                            totalCount: state.totalCount,
                            onPageChange: handlePageChange,
                        }}
                        onSearchTermChange={handleDebounceSearchTerm}
                        searchInputPlaceholder="Search Users..."
                    >
                        {state.users.length === 0 && (
                            <tr>
                                <td colSpan={10}>
                                    <NoResults
                                        title={"No Users Found"}
                                        subtitle={"ry adjusting your search or filters."}
                                    />
                                </td>
                            </tr>
                        )}

                        {state.users.map((user: UserType) => {
                            return (
                                <tr
                                    key={user._id}
                                    className={`cursor-pointer transition-colors duration-200 `}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                        {user.firstName}
                                    </td>
                                    <td className="px-6 py-4">{user.lastName}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.phoneNumber}</td>
                                    <td className="px-6 py-4">{user.deliveryAddress.city}</td>
                                    <td className="px-6 py-4">{user.homeAddress.city}</td>
                                </tr>
                            );
                        })}
                    </AdminTable>
                </section>
            </main>
        </>
    );
};
export default AdminUsersPage;
