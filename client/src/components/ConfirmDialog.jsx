import Modal from './Modal';

export default function ConfirmDialog({ open, title = 'Are you sure?', message, onConfirm, onClose, danger }) {
  return (
    <Modal open={open} title={title} onClose={onClose} footer={
      <>
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-navy-700 hover:bg-navy-800'}`}
        >
          Confirm
        </button>
      </>
    }>
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  );
}
