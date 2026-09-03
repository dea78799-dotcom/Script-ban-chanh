-- [[ TẢI RAYFIELD ]]
local Rayfield = loadstring(game:HttpGet('https://sirius.menu/rayfield'))()

-- [[ CỬA SỔ CHÍNH ]]
local Window = Rayfield:CreateWindow({
   Name = "🍋Menu bán chanh v2.562 (Fixed)",
   Icon = 0,
   LoadingTitle = "Đang tải...",
   LoadingSubtitle = "by Assistant",
   ConfigurationSaving = { Enabled = false },
   Discord = { Enabled = false },
   KeySystem = false
})

-- SERVICES
local Players = game:GetService("Players")
local Player = Players.LocalPlayer
local Character = Player.Character or Player.CharacterAdded:Wait()
local RootPart = Character:WaitForChild("HumanoidRootPart")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

Player.CharacterAdded:Connect(function(newChar)
    Character = newChar
    RootPart = Character:WaitForChild("HumanoidRootPart")
end)

-- STATE & THREADS (Quản lý luồng để tắt triệt để)
local _G_AutoUpgrade = false
local _G_AutoHarvest = false
local _G_AutoRedeem = false
local _G_AutoClickLemonStand = false
local _G_AutoClickLemonDash = false
local _G_AutoClickLemonLabs = false
local _G_AutoBuild = false

local Threads = {
    Upgrade = nil,
    Build = nil,
    Harvest = nil,
    Redeem = nil,
    LemonStand = nil,
    LemonDash = nil,
    LemonLabs = nil
}

-- ============================
-- HÀM TÌM TYCOON CỦA NGƯỜI CHƠI
-- ============================
local function getMyTycoon()
    for _, tycoon in ipairs(Workspace:GetChildren()) do
        if tycoon.Name:sub(1, 6) == "Tycoon" then
            local owner = tycoon:FindFirstChild("Owner") or tycoon:FindFirstChild("OwnerValue")
            if owner and owner.Value == Player then
                return tycoon
            end
        end
    end

    for _, tycoon in ipairs(Workspace:GetChildren()) do
        if tycoon.Name:sub(1, 6) == "Tycoon" then
            if tycoon:FindFirstChild(Player.Name) or tycoon:FindFirstChild(Player.DisplayName) then
                return tycoon
            end
        end
    end

    local closestTycoon = nil
    local shortestDistance = math.huge
    if RootPart then
        for _, tycoon in ipairs(Workspace:GetChildren()) do
            if tycoon.Name:sub(1, 6) == "Tycoon" then
                local primaryPart = tycoon.PrimaryPart or tycoon:FindFirstChildWhichIsA("BasePart", true)
                if primaryPart then
                    local dist = (RootPart.Position - primaryPart.Position).Magnitude
                    if dist < shortestDistance then
                        shortestDistance = dist
                        closestTycoon = tycoon
                    end
                end
            end
        end
    end

    return closestTycoon
end

-- ============================
-- HÀM TÌM REMOTE NÂNG CẤP
-- ============================
local upgradeKeywords = {"LemonDash", "Lemon Stand", "Lemon Depot", "Lemon Trading"}

local function scanUpgradeRemotes()
    local remotes = {}
    for _, v in pairs(game:GetDescendants()) do
        if v:IsA("RemoteFunction") and v.Name == "Upgrade" then
            local path = v:GetFullName()
            for _, keyword in ipairs(upgradeKeywords) do
                if path:find(keyword, 1, true) then
                    table.insert(remotes, v)
                    break
                end
            end
        end
    end
    return remotes
end

-- ============================
-- HÀM DỊCH CHUYỂN TỨC THÌ
-- ============================
local function instantTeleport(pos)
    if not RootPart then return end
    RootPart.CFrame = CFrame.new(pos)
end

-- ============================
-- HÀM TÌM QUẢ "Fruit" TRONG LemonTree
-- ============================
local function FindFruitsInLemonTrees()
    local fruits = {}
    for _, v in pairs(Workspace:GetDescendants()) do
        if v:IsA("BasePart") and v.Name == "Fruit" and v.Parent then
            local parentModel = v:FindFirstAncestor("LemonTree")
            if parentModel and parentModel:IsA("Model") and parentModel.Name == "LemonTree" then
                table.insert(fruits, v)
            end
        end
    end
    return fruits
end

local function FindClickDetector(fruit)
    local clickPart = fruit:FindFirstChild("ClickFruitPart")
    if clickPart then
        local clickDetector = clickPart:FindFirstChildWhichIsA("ClickDetector")
        if clickDetector then return clickDetector end
    end
    return fruit:FindFirstChildWhichIsA("ClickDetector")
end

local function ClickFruit(fruit)
    local clickDetector = FindClickDetector(fruit)
    if not clickDetector then return false end

    if fireclickdetector then
        pcall(function() fireclickdetector(clickDetector) end)
        return true
    end

    if clickDetector.MouseClick then
        pcall(function() firesignal(clickDetector.MouseClick) end)
        return true
    end

    return false
end

local function HarvestOnce()
    local fruits = FindFruitsInLemonTrees()
    if #fruits == 0 then return false end

    for _, fruit in ipairs(fruits) do
        if not _G_AutoHarvest then break end
        if fruit and fruit.Parent then
            instantTeleport(fruit.Position)
            task.wait(0.02)
            ClickFruit(fruit)
            task.wait(0.02)
        end
    end
    return true
end

local function CollectMoneyOnce()
    pcall(function()
        local core = ReplicatedStorage:FindFirstChild("Core")
        if core then
            local remoteRequest = core:FindFirstChild("RemoteRequest")
            if remoteRequest then
                local redeemRemote = remoteRequest:FindFirstChild("DropService.Redeem")
                if redeemRemote and redeemRemote:IsA("RemoteFunction") then
                    redeemRemote:InvokeServer(tostring(math.random(1, 1500)))
                end
            end
        end
    end)
end

local function ClickIncomeStream(itemName)
    for _, v in pairs(Workspace:GetDescendants()) do
        if (v:IsA("RemoteFunction") or v:IsA("RemoteEvent")) and v.Name == "WakeIncomeStream" then
            pcall(function()
                if v:IsA("RemoteFunction") then
                    v:InvokeServer(itemName)
                else
                    v:FireServer(itemName)
                end
            end)
        end
    end
end

-- ============================
-- TAB FARM
-- ============================
local FarmTab = Window:CreateTab("Farm", 4483362458)

FarmTab:CreateParagraph({
    Title = "⚡ Nâng cấp Cực Nhanh",
    Content = "Tự động gửi gói tin nâng cấp liên tục không chờ server."
})

FarmTab:CreateToggle({
    Name = "Nâng cấp (Cực Nhanh)",
    CurrentValue = false,
    Flag = "ToggleUpgrade",
    Callback = function(Value)
        _G_AutoUpgrade = Value
        if Threads.Upgrade then
            task.cancel(Threads.Upgrade)
            Threads.Upgrade = nil
        end

        if _G_AutoUpgrade then
            Rayfield:Notify({Title = "⚡", Content = "Đã bật nâng cấp siêu tốc!", Duration = 2})
            Threads.Upgrade = task.spawn(function()
                local upgradeRemotes = scanUpgradeRemotes()
                local count = 0

                while _G_AutoUpgrade do
                    if #upgradeRemotes > 0 then
                        for _, remote in ipairs(upgradeRemotes) do
                            if not _G_AutoUpgrade then break end
                            -- Bắn dữ liệu nâng cấp không chờ (No-Wait / Non-Blocking)
                            coroutine.wrap(function()
                                pcall(function() remote:InvokeServer(1) end)
                            end)()
                        end
                    end

                    count = count + 1
                    if count >= 10 then
                        upgradeRemotes = scanUpgradeRemotes()
                        count = 0
                    end

                    task.wait(0.001) -- Bắn liên tục
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT nâng cấp hoàn toàn!", Duration = 2})
        end
    end
})

FarmTab:CreateParagraph({
    Title = "🏠 Tự động xây nhà",
    Content = "Sử dụng luồng riêng biệt, tắt là dừng ngay lập tức."
})

FarmTab:CreateButton({
    Name = "Kiểm tra Tycoon hiện tại",
    Callback = function()
        local myTycoon = getMyTycoon()
        if myTycoon then
            Rayfield:Notify({Title = "🏠 Tycoon", Content = "Đã xác nhận: " .. myTycoon.Name, Duration = 3})
        else
            Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Không tìm thấy Tycoon nào!", Duration = 3})
        end
    end,
})

FarmTab:CreateToggle({
    Name = "Tự động xây dựng nhà",
    CurrentValue = false,
    Flag = "ToggleBuildHouse",
    Callback = function(Value)
        _G_AutoBuild = Value
        if Threads.Build then
            task.cancel(Threads.Build)
            Threads.Build = nil
        end

        if _G_AutoBuild then
            Rayfield:Notify({Title = "✅", Content = "Đã bật tự động xây dựng!", Duration = 2})
            Threads.Build = task.spawn(function()
                while _G_AutoBuild do
                    local myTycoon = getMyTycoon()
                    if myTycoon then
                        for _, obj in pairs(myTycoon:GetDescendants()) do
                            if not _G_AutoBuild then break end

                            if obj:IsA("RemoteFunction") and (obj.Name == "Purchase" or obj.Name == "PurchaseBuyEffect") then
                                coroutine.wrap(function()
                                    pcall(function() obj:InvokeServer(false, false) end)
                                end)()
                            elseif obj:IsA("RemoteEvent") and (obj.Name == "Purchase" or obj.Name == "PurchaseBuyEffect") then
                                coroutine.wrap(function()
                                    pcall(function() obj:FireServer(false, false) end)
                                end)()
                            end
                        end
                    end
                    task.wait(0.1)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tự động xây nhà hoàn toàn!", Duration = 2})
        end
    end
})

-- ============================
-- TAB AUTO HARVEST
-- ============================
local HarvestTab = Window:CreateTab("Auto Harvest", 4483362458)

HarvestTab:CreateToggle({
    Name = "Tự động hái quả",
    CurrentValue = false,
    Flag = "ToggleHarvest",
    Callback = function(Value)
        _G_AutoHarvest = Value
        if Threads.Harvest then
            task.cancel(Threads.Harvest)
            Threads.Harvest = nil
        end

        if _G_AutoHarvest then
            Threads.Harvest = task.spawn(function()
                while _G_AutoHarvest do
                    HarvestOnce()
                    task.wait(0.1)
                end
            end)
        end
    end
})

HarvestTab:CreateToggle({
    Name = "Nhặt bao tiền",
    CurrentValue = false,
    Flag = "ToggleCollectMoney",
    Callback = function(Value)
        _G_AutoRedeem = Value
        if Threads.Redeem then
            task.cancel(Threads.Redeem)
            Threads.Redeem = nil
        end

        if _G_AutoRedeem then
            Threads.Redeem = task.spawn(function()
                while _G_AutoRedeem do
                    CollectMoneyOnce()
                    task.wait(0.01)
                end
            end)
        end
    end
})

-- ============================
-- TAB CLICK
-- ============================
local ClickTab = Window:CreateTab("Click", 4483362458)

ClickTab:CreateToggle({
    Name = "Auto Click LemonStand",
    CurrentValue = false,
    Flag = "ToggleClickLemonStand",
    Callback = function(Value)
        _G_AutoClickLemonStand = Value
        if Threads.LemonStand then
            task.cancel(Threads.LemonStand)
            Threads.LemonStand = nil
        end

        if _G_AutoClickLemonStand then
            Threads.LemonStand = task.spawn(function()
                while _G_AutoClickLemonStand do
                    ClickIncomeStream("LemonStand")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonDash",
    CurrentValue = false,
    Flag = "ToggleClickLemonDash",
    Callback = function(Value)
        _G_AutoClickLemonDash = Value
        if Threads.LemonDash then
            task.cancel(Threads.LemonDash)
            Threads.LemonDash = nil
        end

        if _G_AutoClickLemonDash then
            Threads.LemonDash = task.spawn(function()
                while _G_AutoClickLemonDash do
                    ClickIncomeStream("LemonDash")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonLabs",
    CurrentValue = false,
    Flag = "ToggleClickLemonLabs",
    Callback = function(Value)
        _G_AutoClickLemonLabs = Value
        if Threads.LemonLabs then
            task.cancel(Threads.LemonLabs)
            Threads.LemonLabs = nil
        end

        if _G_AutoClickLemonLabs then
            Threads.LemonLabs = task.spawn(function()
                while _G_AutoClickLemonLabs do
                    ClickIncomeStream("LemonLabs")
                    task.wait(0.05)
                end
            end)
        end
    end
})

Rayfield:Notify({Title = "🍋", Content = "Menu bán chanh v2.562 đã sẵn sàng!", Duration = 3})
