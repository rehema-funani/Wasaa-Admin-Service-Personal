import { Clock, DollarSign, Info, Users, } from "lucide-react";
import { motion } from "framer-motion";
import React from 'react'

const EscrowDetailOverview = ({
    escrow,
    formatCurrency,
    formatDate,
    getStatusBadge,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Basic Information
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Escrow ID</label>
              <p className="font-mono text-sm text-gray-800 bg-white p-2 rounded border mt-1">
                {escrow.id || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <div className="mt-2">{getStatusBadge(escrow.status)}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Purpose</label>
              <p className="text-sm text-gray-800 mt-1">
                {escrow.purpose || "Not specified"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Payment Method</label>
              <p className="text-sm text-gray-800 mt-1">
                Method ID: {escrow.paymentMethodId || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Tenant ID</label>
            <p className="font-mono text-xs text-gray-600 mt-1">
              {escrow.tenantId || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Parties
        </h4>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-800">Initiator</h5>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {escrow.initiator?.charAt(0) || "U"}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {escrow.initiator || "Not specified"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ID: {escrow.buyerId || "N/A"}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-800">Counterparty</h5>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {escrow.counterparty?.charAt(0) || "U"}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {escrow.counterparty || "Not specified"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ID: {escrow.sellerId || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Timeline
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Created</span>
            <span className="text-sm text-gray-800">
              {formatDate(escrow.createdAt)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Last Updated</span>
            <span className="text-sm text-gray-800">
              {formatDate(escrow.updatedAt)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Deadline</span>
            <span className="text-sm text-gray-800">
              {formatDate(escrow.deadline)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Financial Summary
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Amount</span>
            <span className="font-semibold text-gray-800">
              {formatCurrency(
                escrow.amountMinor || "0",
                escrow.currency || "KES"
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Funded</span>
            <span className="font-medium text-blue-600">
              {formatCurrency(
                escrow.fundedMinor || "0",
                escrow.currency || "KES"
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Released</span>
            <span className="font-medium text-emerald-600">
              {formatCurrency(
                escrow.releasedMinor || "0",
                escrow.currency || "KES"
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Refunded</span>
            <span className="font-medium text-orange-600">
              {formatCurrency(
                escrow.refundedMinor || "0",
                escrow.currency || "KES"
              )}
            </span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Remaining</span>
              <span className="font-bold text-gray-800">
                {formatCurrency(
                  (
                    parseInt(escrow.amountMinor || "0") -
                    parseInt(escrow.releasedMinor || "0") -
                    parseInt(escrow.refundedMinor || "0")
                  ).toString(),
                  escrow.currency || "KES"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default EscrowDetailOverview
