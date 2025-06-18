import Button from '@/components/shared/Button/Button';
import React from 'react';

const ColumnSelector = ({
    columns = [],
    visibleColumns = [],
    onClose,
    onColumnVisibilityChange
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Visible Columns</h2>
                <p className="text-gray-600 mb-4">Select which columns you want to display in the table.</p>

                <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
                    {columns.map(column => (
                        <div key={column.key} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`column-${column.key}`}
                                checked={visibleColumns.includes(column.key)}
                                onChange={(e) => onColumnVisibilityChange(column.key, e.target.checked)}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor={`column-${column.key}`} className="ml-2 text-gray-700">
                                {column.header}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        title="Cancel"
                        variant="secondary"
                        size="sm"
                        onClick={onClose}
                    />
                    <Button
                        title="Apply Changes"
                        size="sm"
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default ColumnSelector;