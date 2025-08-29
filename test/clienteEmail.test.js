import { procurarEmail } from "../src/components/fetchClientes"
import { supabase } from "../src/supabase/supabaseClient"

jest.mock("../src/supabase/supabaseClient", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({
      data: [{ email: "su.grotti@gmail.com" }], 
      error: null
    })
  }
}))

test('retornar email correto', async () => {
    const email = await procurarEmail(13)
    expect(email[0].email).toBe('su.grotti@gmail.com')
})