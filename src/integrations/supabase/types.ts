export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          document_type: string | null
          file_url: string | null
          id: string
          title: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          document_type?: string | null
          file_url?: string | null
          id?: string
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          document_type?: string | null
          file_url?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      "JOB CARD UPDATE": {
        Row: {
          'Can be energized? (if Work Pending is "Yes")': string | null
          'Can be moved? (if Work Pending is "Yes")': string | null
          "Car Lifting Required? (Yes or No)": string | null
          "Car No": string | null
          "CM/PM/OPM": string | null
          Component: string | null
          "Components Taken In Date": string | null
          "Components Taken Out Date": string | null
          "Date of Action Endorsement": string | null
          "Delay Duration (if Service Distinction is Delay)": string | null
          'Delay Time (if Delay is "Yes")': string | null
          "Delay?": string | null
          "Depot Arriving Date": string | null
          "Depot Arriving Time": string | null
          "Description of actions taken": string | null
          "Duration of Repair (hr)": number | null
          "Effects on Train Service (Yes / No)": string | null
          Equipments: string | null
          "Expected Complete Date": string | null
          "Expected Complete Time": string | null
          "Failure Category": string | null
          "Failure Description": string | null
          "Failure Descriptions": string | null
          "Failure Details": string | null
          "Failure Location": string | null
          "Failure Name": string | null
          "Failure Occurred Date": string | null
          "Failure Occurred Time": string | null
          "FRACAS No\\.": number
          Inspector: string | null
          "JC No": string
          "Job Card Close Date": string | null
          "Job Card Close Time": string | null
          "Job Card Issued Date": string | null
          "Job Card Issued Time": string | null
          "Job Card Issued to": string | null
          "Job Operating Conditions (Case CM)": string | null
          "Name of Action Endorsement": string | null
          "NCR No\\.": string | null
          "No\\. of Men": number | null
          "Part(s)": string | null
          "Replace / Change Info\\. (Yes or No)": string | null
          "Reported By": string | null
          "Reporting Location": string | null
          "Root Cause": string | null
          "Serial No\\.": string | null
          "Serial No\\. of Components Taken In": string | null
          "Serial No\\. of Components Taken Out": string | null
          "Service Checks (Case PM)": string | null
          "Service Distinction (Case CM)": string | null
          "Sub-System": string | null
          System: string | null
          "Train No\\.": string | null
          "TRAIN ODOMETRE READING DATA (in kms)": number | null
          "Withdraw?": string | null
          "Work Pending?": string | null
          "Workflow States": string | null
        }
        Insert: {
          'Can be energized? (if Work Pending is "Yes")'?: string | null
          'Can be moved? (if Work Pending is "Yes")'?: string | null
          "Car Lifting Required? (Yes or No)"?: string | null
          "Car No"?: string | null
          "CM/PM/OPM"?: string | null
          Component?: string | null
          "Components Taken In Date"?: string | null
          "Components Taken Out Date"?: string | null
          "Date of Action Endorsement"?: string | null
          "Delay Duration (if Service Distinction is Delay)"?: string | null
          'Delay Time (if Delay is "Yes")'?: string | null
          "Delay?"?: string | null
          "Depot Arriving Date"?: string | null
          "Depot Arriving Time"?: string | null
          "Description of actions taken"?: string | null
          "Duration of Repair (hr)"?: number | null
          "Effects on Train Service (Yes / No)"?: string | null
          Equipments?: string | null
          "Expected Complete Date"?: string | null
          "Expected Complete Time"?: string | null
          "Failure Category"?: string | null
          "Failure Description"?: string | null
          "Failure Descriptions"?: string | null
          "Failure Details"?: string | null
          "Failure Location"?: string | null
          "Failure Name"?: string | null
          "Failure Occurred Date"?: string | null
          "Failure Occurred Time"?: string | null
          "FRACAS No\\.": number
          Inspector?: string | null
          "JC No": string
          "Job Card Close Date"?: string | null
          "Job Card Close Time"?: string | null
          "Job Card Issued Date"?: string | null
          "Job Card Issued Time"?: string | null
          "Job Card Issued to"?: string | null
          "Job Operating Conditions (Case CM)"?: string | null
          "Name of Action Endorsement"?: string | null
          "NCR No\\."?: string | null
          "No\\. of Men"?: number | null
          "Part(s)"?: string | null
          "Replace / Change Info\\. (Yes or No)"?: string | null
          "Reported By"?: string | null
          "Reporting Location"?: string | null
          "Root Cause"?: string | null
          "Serial No\\."?: string | null
          "Serial No\\. of Components Taken In"?: string | null
          "Serial No\\. of Components Taken Out"?: string | null
          "Service Checks (Case PM)"?: string | null
          "Service Distinction (Case CM)"?: string | null
          "Sub-System"?: string | null
          System?: string | null
          "Train No\\."?: string | null
          "TRAIN ODOMETRE READING DATA (in kms)"?: number | null
          "Withdraw?"?: string | null
          "Work Pending?"?: string | null
          "Workflow States"?: string | null
        }
        Update: {
          'Can be energized? (if Work Pending is "Yes")'?: string | null
          'Can be moved? (if Work Pending is "Yes")'?: string | null
          "Car Lifting Required? (Yes or No)"?: string | null
          "Car No"?: string | null
          "CM/PM/OPM"?: string | null
          Component?: string | null
          "Components Taken In Date"?: string | null
          "Components Taken Out Date"?: string | null
          "Date of Action Endorsement"?: string | null
          "Delay Duration (if Service Distinction is Delay)"?: string | null
          'Delay Time (if Delay is "Yes")'?: string | null
          "Delay?"?: string | null
          "Depot Arriving Date"?: string | null
          "Depot Arriving Time"?: string | null
          "Description of actions taken"?: string | null
          "Duration of Repair (hr)"?: number | null
          "Effects on Train Service (Yes / No)"?: string | null
          Equipments?: string | null
          "Expected Complete Date"?: string | null
          "Expected Complete Time"?: string | null
          "Failure Category"?: string | null
          "Failure Description"?: string | null
          "Failure Descriptions"?: string | null
          "Failure Details"?: string | null
          "Failure Location"?: string | null
          "Failure Name"?: string | null
          "Failure Occurred Date"?: string | null
          "Failure Occurred Time"?: string | null
          "FRACAS No\\."?: number
          Inspector?: string | null
          "JC No"?: string
          "Job Card Close Date"?: string | null
          "Job Card Close Time"?: string | null
          "Job Card Issued Date"?: string | null
          "Job Card Issued Time"?: string | null
          "Job Card Issued to"?: string | null
          "Job Operating Conditions (Case CM)"?: string | null
          "Name of Action Endorsement"?: string | null
          "NCR No\\."?: string | null
          "No\\. of Men"?: number | null
          "Part(s)"?: string | null
          "Replace / Change Info\\. (Yes or No)"?: string | null
          "Reported By"?: string | null
          "Reporting Location"?: string | null
          "Root Cause"?: string | null
          "Serial No\\."?: string | null
          "Serial No\\. of Components Taken In"?: string | null
          "Serial No\\. of Components Taken Out"?: string | null
          "Service Checks (Case PM)"?: string | null
          "Service Distinction (Case CM)"?: string | null
          "Sub-System"?: string | null
          System?: string | null
          "Train No\\."?: string | null
          "TRAIN ODOMETRE READING DATA (in kms)"?: number | null
          "Withdraw?"?: string | null
          "Work Pending?"?: string | null
          "Workflow States"?: string | null
        }
        Relationships: []
      }
      letters: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          letter_date: string | null
          letter_type: string | null
          recipient: string | null
          reference_no: string
          sender: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          letter_date?: string | null
          letter_type?: string | null
          recipient?: string | null
          reference_no: string
          sender?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          letter_date?: string | null
          letter_type?: string | null
          recipient?: string | null
          reference_no?: string
          sender?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "letters_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_assignments: {
        Row: {
          assigned_by: string | null
          assigned_to: string | null
          comments: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          schedule_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          assigned_to?: string | null
          comments?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          schedule_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string | null
          comments?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          schedule_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_assignments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_assignments_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "maintenance_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_schedules: {
        Row: {
          assigned_by: string | null
          car_no: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          schedule_type: string
          status: string | null
          sub_system: string | null
          system: string | null
          title: string
          train_no: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          car_no?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          schedule_type: string
          status?: string | null
          sub_system?: string | null
          system?: string | null
          title: string
          train_no?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          car_no?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          schedule_type?: string
          status?: string | null
          sub_system?: string | null
          system?: string | null
          title?: string
          train_no?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      mp_tools: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          last_calibration_date: string | null
          location: string | null
          make: string | null
          model: string | null
          name: string
          next_calibration_date: string | null
          purchase_date: string | null
          serial_number: string | null
          status: string | null
          updated_at: string | null
          warranty_expiry: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_calibration_date?: string | null
          location?: string | null
          make?: string | null
          model?: string | null
          name: string
          next_calibration_date?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_calibration_date?: string | null
          location?: string | null
          make?: string | null
          model?: string | null
          name?: string
          next_calibration_date?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Relationships: []
      }
      ncr_reports: {
        Row: {
          car: string | null
          created_at: string | null
          created_by: string | null
          date_of_detection: string | null
          date_of_investigation_received: string | null
          date_of_ncr: string | null
          date_of_repaired_replaced: string | null
          faulty_serial_no: string | null
          fmi: string | null
          gate_pass_no: string | null
          healthy_serial_no: string | null
          id: string
          issued_by: string | null
          item_description: string | null
          item_repaired_replaced: string | null
          item_replaced: string | null
          modified_unmodified: string | null
          ncr_closed_by_doc: boolean | null
          ncr_description: string | null
          part_number: string | null
          quantity: number | null
          remarks: string | null
          report_no: string
          responsibility: string | null
          source: string | null
          status: string | null
          sub_system: string | null
          train_no: string | null
          updated_at: string | null
        }
        Insert: {
          car?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_detection?: string | null
          date_of_investigation_received?: string | null
          date_of_ncr?: string | null
          date_of_repaired_replaced?: string | null
          faulty_serial_no?: string | null
          fmi?: string | null
          gate_pass_no?: string | null
          healthy_serial_no?: string | null
          id?: string
          issued_by?: string | null
          item_description?: string | null
          item_repaired_replaced?: string | null
          item_replaced?: string | null
          modified_unmodified?: string | null
          ncr_closed_by_doc?: boolean | null
          ncr_description?: string | null
          part_number?: string | null
          quantity?: number | null
          remarks?: string | null
          report_no: string
          responsibility?: string | null
          source?: string | null
          status?: string | null
          sub_system?: string | null
          train_no?: string | null
          updated_at?: string | null
        }
        Update: {
          car?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_detection?: string | null
          date_of_investigation_received?: string | null
          date_of_ncr?: string | null
          date_of_repaired_replaced?: string | null
          faulty_serial_no?: string | null
          fmi?: string | null
          gate_pass_no?: string | null
          healthy_serial_no?: string | null
          id?: string
          issued_by?: string | null
          item_description?: string | null
          item_repaired_replaced?: string | null
          item_replaced?: string | null
          modified_unmodified?: string | null
          ncr_closed_by_doc?: boolean | null
          ncr_description?: string | null
          part_number?: string | null
          quantity?: number | null
          remarks?: string | null
          report_no?: string
          responsibility?: string | null
          source?: string | null
          status?: string | null
          sub_system?: string | null
          train_no?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ncr_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      spare_parts: {
        Row: {
          created_at: string | null
          description: string
          id: string
          location: string | null
          min_stock_level: number | null
          part_number: string
          quantity: number | null
          sub_system: string | null
          system: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          location?: string | null
          min_stock_level?: number | null
          part_number: string
          quantity?: number | null
          sub_system?: string | null
          system?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          location?: string | null
          min_stock_level?: number | null
          part_number?: string
          quantity?: number | null
          sub_system?: string | null
          system?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spare_parts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string | null
          department: string | null
          designation: string | null
          email: string
          id: string
          name: string
          phone: string | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          category: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: string
      }
      log_activity: {
        Args: {
          _user_id: string
          _action: string
          _entity_type: string
          _entity_id: string
          _details: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
