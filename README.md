# @winglab/react-table

A React data-table component using shadcn/ui.

## Install Component
```bash
# Component
npm install @winglab/react-table

# Dependencies
npm install radix-ui nuqs
```

## Basic usage

```tsx
// user/index.tsx
import { ColumnsDef, RequestTable } from '@winglab/react-table';

export default function UsersPage() {
    const columns = ColumnsDef<UserType>([
        {
            dataKey: 'name',
            title: 'User',
            sortable: true,
        },
        {
            dataKey: 'phone',
            title: 'Phone',
            sortable: true,
        },
        {
            dataKey: 'email',
            title: 'Email',
            sortable: true,
        },
        {
            dataKey: 'role',
            title: 'Role',
            tableRowRender: (data) => (
                <>
                    {data.role === 'user' && 'User'}
                    {data.role === 'admin' && 'Admin'}
                </>
            ),
            filters: [
                { label: 'User', value: 'user' },
                { label: 'Admin', value: 'admin' },
            ],
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <Button asChild variant="secondary">
                        <Link href={'/users/' + data.id}>View</Link>
                    </Button>
                );
            },
        },
    ]);

    return (
        <Layout>
            <RequestTable
                columns={columns}
                request={async (params) => {
                    return { data, total };
                }}
                onSelectChange={console.log}
                showSearchInput={true}
                saveStateToQuery={true}
            />
        </Layout>
    );
}

```