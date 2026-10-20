import { z } from 'zod';
import { referralTargetSchema } from '../referrals/validation';

export const createConsultationSchema = z.object({
  appointmentId: z.string().min(1),
  outcome: z.enum(['resolved', 'referred', 'follow_up_needed']).optional(),
  notes: z.string().trim().min(1).optional(),
  targetSpecialtyId: z.string().min(1).optional(),
  targetDoctorId: z.string().min(1).optional(),
}).superRefine((value, ctx) => {
  if (value.outcome === 'referred' && !value.targetSpecialtyId) {
    ctx.addIssue({ code: 'custom', path: ['targetSpecialtyId'], message: 'Required when outcome is referred.' });
  }
  if (value.outcome !== 'referred' && (value.targetSpecialtyId || value.targetDoctorId)) {
    ctx.addIssue({ code: 'custom', path: ['targetSpecialtyId'], message: 'Referral target is only valid for a referred consultation.' });
  }
});

export const createReferralsSchema = z.object({
  targets: z.array(referralTargetSchema).min(1),
});
